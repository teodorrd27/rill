import { test, expect } from 'bun:test'
import { base64ToUint8Array } from '../../../src/lib/utils'

test('base64ToUint8Array', () => {
  test('should convert base64 string to Uint8Array', () => {
    // Simple ASCII test
    const base64Str = 'SGVsbG8gV29ybGQ=' // 'Hello World' in base64
    const result = base64ToUint8Array(base64Str)
    
    // Check if result is a Uint8Array
    expect(result).toBeInstanceOf(Uint8Array)
    
    // Check the length
    expect(result.length).toBe(11)
    
    // Check specific values
    const expected = new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100])
    for (let i = 0; i < expected.length; i++) {
      expect(result[i]).toBe(expected[i])
    }
  })
  
  test('should handle empty string', () => {
    const result = base64ToUint8Array('')
    
    expect(result).toBeInstanceOf(Uint8Array)
    expect(result.length).toBe(0)
  })
  
  test('should handle non-ASCII characters', () => {
    // '👋 Hello' in base64
    const base64Str = '8J+RiyBIZWxsbw=='
    const result = base64ToUint8Array(base64Str)
    
    expect(result).toBeInstanceOf(Uint8Array)
    expect(result.length).toBe(9)
    
    // Expected UTF-8 bytes for '👋 Hello'
    const expected = new Uint8Array([240, 159, 145, 139, 32, 72, 101, 108, 108, 111, 0])
    expect(result.length).toBe(expected.length)
  })
})
