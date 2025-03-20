import { test, expect, describe } from 'bun:test'
import * as Y from 'yjs'
import { base64ToUint8Array } from '../../../src/lib/utils'

// We'll focus on testing the base64ToUint8Array utility which is used by the WebSocketContext
// Since testing the React component requires React testing libraries and proper DOM
// This approach avoids the React component testing complexities

describe('WebSocket utilities', () => {
  test('base64ToUint8Array correctly converts base64 to Uint8Array for WebSocket messages', () => {
    // Create a sample update that might be sent via WebSocket
    const originalData = new Uint8Array([1, 2, 3, 4, 5])
    
    // Convert to base64 (simulating what would happen in transmission)
    const base64Data = Buffer.from(originalData).toString('base64')
    
    // Use the utility to convert back (simulating receiving a message)
    const convertedData = base64ToUint8Array(base64Data)
    
    // Verify the data is correctly transformed
    expect(convertedData).toBeInstanceOf(Uint8Array)
    expect(convertedData.length).toBe(originalData.length)
    
    // Check each byte matches
    for (let i = 0; i < originalData.length; i++) {
      expect(convertedData[i]).toBe(originalData[i])
    }
  })
  
  test('Y.js can apply updates from Uint8Array data', () => {
    // Create two Y.Doc instances (simulating two connected clients)
    const sourceDoc = new Y.Doc()
    const targetDoc = new Y.Doc()
    
    // Make a change to the source doc
    const ymap = sourceDoc.getMap('testMap')
    ymap.set('key1', 'value1')
    
    // Create an update that would be sent over WebSocket
    const update = Y.encodeStateAsUpdate(sourceDoc)
    
    // Convert to base64 and back (simulating WebSocket transmission)
    const base64Update = Buffer.from(update).toString('base64')
    const receivedUpdate = base64ToUint8Array(base64Update)
    
    // Apply the update to the target doc
    Y.applyUpdate(targetDoc, receivedUpdate)
    
    // Verify the target doc received the changes
    const targetMap = targetDoc.getMap('testMap')
    expect(targetMap.get('key1')).toBe('value1')
  })
  
  // Additional test for error handling or edge cases could be added here
})

// For fully testing the WebSocketContext and WebSocketProvider,
// you would need to setup React testing with something like:
// npm install -D @testing-library/react
