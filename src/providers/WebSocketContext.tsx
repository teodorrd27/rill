import { base64ToUint8Array } from '@/lib/utils'
import { createContext, FC, PropsWithChildren, useEffect, useMemo, useState } from 'react'
import * as Y from 'yjs'

interface WebSocketContextProps {
  ydoc: Y.Doc
}

const genOnOpen = (ydoc: Y.Doc): typeof WebSocket.prototype.onopen => function() {
  ydoc.on('update', (update) => {
    this.send(update)
  })
}

const genOnMessage = (ydoc: Y.Doc): typeof WebSocket.prototype.onmessage => function(message: MessageEvent<string>) {
  const buffer = base64ToUint8Array(message.data)  
  Y.applyUpdate(ydoc, buffer)
}

const WebSocketContext = createContext<WebSocketContextProps | null>(null)

const WebSocketProvider: FC<PropsWithChildren> = ({ children }) => {
  const ydoc = useMemo(() => new Y.Doc(), [])

  const [, setWS] = useState<WebSocket | null>(null)

  useEffect(() => {
    const newWS = new WebSocket('http://localhost:3000/') // TODO: Pass this in from an env config.
    newWS.onmessage = genOnMessage(ydoc)
    newWS.onopen = genOnOpen(ydoc)
    setWS(newWS)
    return (() => {
      newWS.close()
    })
  }, [ydoc])

  return (
    <WebSocketContext.Provider value={{ydoc}}>{children}</ WebSocketContext.Provider>
  )
}

export { WebSocketProvider, WebSocketContext }
