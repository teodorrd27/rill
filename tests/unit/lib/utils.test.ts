import { test, expect, describe } from "bun:test";
import { cn, base64ToUint8Array } from "../../../src/lib/utils";

describe("cn utility", () => {
  test("combines classes correctly", () => {
    const result = cn("class1", "class2");
    expect(result).toBe("class1 class2");
  });

  test("handles conditional classes", () => {
    const result = cn("base", { "conditional": true, "not-included": false });
    expect(result).toBe("base conditional");
  });

  test("handles array of classes", () => {
    const result = cn("base", ["array-item1", "array-item2"]);
    expect(result).toBe("base array-item1 array-item2");
  });

  test("handles empty inputs", () => {
    const result = cn();
    expect(result).toBe("");
  });
});

describe("base64ToUint8Array utility", () => {
  test("converts base64 string to Uint8Array", () => {
    // "Hello World" in base64
    const base64 = "SGVsbG8gV29ybGQ=";
    const result = base64ToUint8Array(base64);
    
    expect(result).toBeInstanceOf(Uint8Array);
    expect(result.length).toBe(11);
    
    // Check specific bytes for "Hello World"
    expect(result[0]).toBe(72);  // H
    expect(result[1]).toBe(101); // e
    expect(result[2]).toBe(108); // l
  });

  test("handles empty string", () => {
    const result = base64ToUint8Array("");
    expect(result.length).toBe(0);
  });

  test("handles special characters", () => {
    // "!@#$%^&*()" in base64
    const base64 = "IUAjJCVeJiooKQ==";
    const result = base64ToUint8Array(base64);
    
    expect(result).toBeInstanceOf(Uint8Array);
    expect(result.length).toBe(10);
  });
}); 
