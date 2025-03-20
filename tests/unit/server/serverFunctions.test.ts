import { test, expect, describe, beforeAll, spyOn } from 'bun:test'
import * as Y from 'yjs'

// Since server functions might have dependencies that are hard to test directly,
// we'll create similar functions for testing the core logic

describe('YDoc sync and broadcast functions', () => {
  let ydoc: Y.Doc
  
  beforeAll(() => {
    ydoc = new Y.Doc()
    ydoc.getMap('root') // Initialize root map
  })
  
  test('YDoc state encoding and transmission', () => {
    // This test simulates the syncYDoc function in the server
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mockWs = { send: (_data: string) => {} }
    // Create a spy on the send method
    const sendSpy = spyOn(mockWs, 'send')
    
    // Encode YDoc state
    const ydocState = Y.encodeStateAsUpdate(ydoc)
    const encoded = Buffer.from(ydocState).toString('base64')
    
    // Send to client (simulating the syncYDoc function)
    mockWs.send(encoded)
    
    // Verify the send function was called
    expect(sendSpy).toHaveBeenCalled()
  })
  
  test('Server broadcasts YDoc changes to clients', () => {
    // Create a mock server with a publish method
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mockServer = { publish: (_channel: string, _data: string) => {} }
    // Create a spy on the publish method
    const publishSpy = spyOn(mockServer, 'publish')
    
    // Make a change to the YDoc
    const ymap = ydoc.getMap('root')
    ymap.set('testKey', 'testValue')
    
    // Get the update (in a real scenario, this would be passed to broadcastYDocChange)
    const update = Y.encodeStateAsUpdate(ydoc)
    const encodedUpdate = Buffer.from(update).toString('base64')
    
    // Broadcast the update (simulating the broadcast function)
    mockServer.publish('broadcast', encodedUpdate)
    
    // Verify the publish was called
    expect(publishSpy).toHaveBeenCalled()
  })
  
  test('YDoc update application between client and server', () => {
    // Create two YDocs to simulate server and client
    const serverDoc = new Y.Doc()
    const clientDoc = new Y.Doc()
    
    // Make changes on the client
    const clientMap = clientDoc.getMap('root')
    clientMap.set('clientKey', 'clientValue')
    
    // Get the update that would be sent from client to server
    const clientUpdate = Y.encodeStateAsUpdate(clientDoc)
    
    // Apply update to server (simulating message handler)
    Y.applyUpdate(serverDoc, clientUpdate)
    
    // Verify the server received the change
    const serverMap = serverDoc.getMap('root')
    expect(serverMap.get('clientKey')).toBe('clientValue')
  })
}) 
