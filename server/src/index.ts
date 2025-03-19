import Elysia, { t } from 'elysia'
import type { ElysiaWS } from 'elysia/ws'
import dayjs from 'dayjs'

import getYjs from './utils/yjs.import'
const Y = await getYjs()

const inMemorySession = new Y.Doc()

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
  for (const [key, value] of inMemorySession.share.entries()) {
    console.log('value is ', key)
    if (value instanceof Y.XmlFragment) {
      console.log(`Found XML fragment: ${key}`);
    }
  }
  broadcastYDocChange(update, app)
})

const app = new Elysia()
  .group('/', (app) => {
    return app
    .derive(() => {
      const uuid = crypto.randomUUID()

      return {
        uuid: uuid,
        whatevertheFuck: 'fuck off',
      }
    })
    .ws('/', {
      body: t.Union([t.String(), t.Uint8Array()]),
      response: t.Union([t.String(), t.Uint8Array()]),
      message: (ws, message) => {
        if (message instanceof Uint8Array) {
          console.log('receiving message ', message)
          Y.applyUpdate(inMemorySession, message)
        }
        // Handle message
      },
      open: async (ws) => {
        ws.subscribe('broadcast')
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

console.log('elysia running on localhost:3000')
