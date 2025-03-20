import { test, expect, describe, beforeEach, afterEach } from "bun:test";

describe("YJS Import Utility", () => {
  // Store the original global.__YJS__ to restore after tests
  const originalYJS = globalThis.__YJS__;
  
  // Reset before each test
  beforeEach(() => {
    // Clear the global YJS instance
    delete globalThis.__YJS__;
  });
  
  // Restore after all tests
  afterEach(() => {
    globalThis.__YJS__ = originalYJS;
  });
  
  test("getYjs returns cached instance when available", async () => {
    // Create a mock YJS instance
    // Using any type to avoid type errors with the full YJS interface
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockYJS = { Doc: function() {} } as any;
    globalThis.__YJS__ = mockYJS;
    
    // Import the getYjs function
    const getYjs = (await import('../../../server/src/utils/yjs.import')).default;
    
    // Get the YJS instance
    const result = await getYjs();
    
    // Verify it's the same mock instance
    expect(result).toBe(mockYJS);
  });
  
  test("getYjs imports and caches YJS when not available", async () => {
    // Make sure global YJS is not defined
    expect(globalThis.__YJS__).toBeUndefined();
    
    // Import the getYjs function
    const getYjs = (await import('../../../server/src/utils/yjs.import')).default;
    
    // Get the YJS instance - this should trigger the import
    const result = await getYjs();
    
    // Verify we got a YJS instance (note: this is a real import)
    expect(result).toBeDefined();
    expect(typeof result.Doc).toBe('function');
    
    // Verify it was cached
    expect(globalThis.__YJS__).toBe(result);
    
    // Call again and verify the same instance is returned
    const secondResult = await getYjs();
    expect(secondResult).toBe(result);
  });
}); 
