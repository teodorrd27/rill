import Elysia, { t } from 'elysia'
import type { ElysiaWS } from 'elysia/ws'
import dayjs from 'dayjs'

import { staticPlugin } from '@elysiajs/static'

import getYjs from './utils/yjs.import'
const Y = await getYjs()

const inMemorySession = new Y.Doc()
inMemorySession.getMap('root')

interface WSSessions {
  [userUUID: string]: {
    connectedAt: dayjs.Dayjs,
  }
}
const wsSessions: WSSessions = {}

const syncYDoc = (ws: ElysiaWS) => {
  const ydocState = Y.encodeStateAsUpdate(inMemorySession)
  const encoded = Buffer.from(ydocState).toString('base64')
  ws.send(encoded)
}

const broadcastYDocChange = (update: Uint8Array<ArrayBufferLike>, app: Elysia) => {
  const encodedUpdate = Buffer.from(update).toString('base64')
  app.server?.publish('broadcast', encodedUpdate)
}

inMemorySession.on('update', (update) => {
  console.log('update')
  broadcastYDocChange(update, app)
})

const app = new Elysia()

if (Bun.env.NODE_ENV === 'production') {
  app.use(staticPlugin({
    assets: 'dist',
    prefix: '/',
  }))
}

app.group('/', (app) => {
    return app
    .derive(() => {
      const uuid = crypto.randomUUID()

      return {
        uuid
      }
    })
    .ws('/', {
      body: t.Union([t.String(), t.Uint8Array()]),
      response: t.Union([t.String(), t.Uint8Array()]),
      message: (ws, message) => {
        if (message instanceof Uint8Array) {
          ws.unsubscribe('broadcast')
          Y.applyUpdate(inMemorySession, message)
          ws.subscribe('broadcast')
        }
        // Handle message
      },
      open: async (ws) => {
        ws.subscribe('broadcast')
        console.log('connected ', ws.data.uuid)
        wsSessions[ws.data.uuid] = {
          connectedAt: dayjs()
        }
        syncYDoc(ws)
      },
      close: async (ws) => {
        ws.unsubscribe('broadcast')
        console.log('disconnected: ', ws.data.uuid)
        delete wsSessions[ws.data.uuid]
      },
      error: async (ws) => {
        console.log('websocket error: ', ws.error)
      },
      drain: () => console.log('ready for more data')
    })

  })
  .get('/whosconnected', () => new Response(JSON.stringify(wsSessions)))
  .all('/health', () => new Response('Healthy!'))
  .listen(3000)

console.log('Server running on localhost:3000')
