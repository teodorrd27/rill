import { base64ToUint8Array } from '@/lib/utils'
import { createContext, FC, PropsWithChildren, useEffect, useMemo, useState } from 'react'
import * as Y from 'yjs'

interface WebSocketContextProps {
  ydoc: Y.Doc
  updateCounter: number
  ws: WebSocket | null
}

const genOnOpen = (ydoc: Y.Doc): typeof WebSocket.prototype.onopen => function() {
  ydoc.on('update', (update) => {
    console.log('sending update')
    this.send(update)
  })
}

const genOnMessage = (ydoc: Y.Doc, setUpdateCounter: React.Dispatch<React.SetStateAction<number>>): typeof WebSocket.prototype.onmessage => function(message: MessageEvent<string>) {
  const buffer = base64ToUint8Array(message.data)  
  const currentKeys1 = Array.from(ydoc.getMap('root').keys());
  console.log('Current keys in ydoc1:', currentKeys1);
  Y.applyUpdate(ydoc, buffer)
  const currentKeys = Array.from(ydoc.getMap('root').keys());
  console.log('Current keys in ydoc2:', currentKeys);
  setUpdateCounter(prev => prev + 1)
}

const WebSocketContext = createContext<WebSocketContextProps | null>(null)

const WebSocketProvider: FC<PropsWithChildren> = ({ children }) => {
  const ydoc = useMemo(() => new Y.Doc(), [])
  const [updateCounter, setUpdateCounter] = useState(0)

  const [WS, setWS] = useState<WebSocket | null>(null)

  useEffect(() => {
    const newWS = new WebSocket('http://localhost:3000/') // TODO: Pass this in from an env config.
    newWS.onmessage = genOnMessage(ydoc, setUpdateCounter)
    newWS.onopen = genOnOpen(ydoc)
    setWS(newWS)
    return (() => {
      newWS.close()
    })
  }, [ydoc])

  return (
    <WebSocketContext.Provider value={{ydoc, updateCounter, ws: WS}}>{children}</ WebSocketContext.Provider>
  )
}

export { WebSocketProvider, WebSocketContext }
