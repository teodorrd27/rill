// Optional: declare global type for TypeScript
declare global {
  // eslint-disable-next-line no-var
  var __YJS__: typeof import('yjs') | undefined
}

// yjs-loader.ts
export default async function getYjs() {
  if (!globalThis.__YJS__) {
    const Y = await import('yjs')
    globalThis.__YJS__ = Y
  }
  return globalThis.__YJS__
}
