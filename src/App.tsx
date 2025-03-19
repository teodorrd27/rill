import RillLogo from '@/assets/rill-logo.png'

import { useEffect, useState } from 'react'

import * as Y from 'yjs'
import { EditorWidget } from './tiptap.widget'

const ydoc = new Y.Doc()

function base64ToUint8Array(base64: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

const onopen: typeof WebSocket.prototype.onopen = function() {
  console.log('this ready state ', this.readyState)
  ydoc.on('update', (update) => {
    console.log('ydoc updated')
    this.send(update)
  })
}

const onmessage: typeof WebSocket.prototype.onmessage = function(message: MessageEvent<string>) {
  const buffer = base64ToUint8Array(message.data)
  try {
    console.log('message is ', buffer)
    
  }catch(err) { console.log(err)}
  // const binary = String.fromCharCode(...message.data);
  // Encode to base64

  Y.applyUpdate(ydoc, buffer)
}

export default function Home() {
  const [, _setWS] = useState<WebSocket | null>(null)

  useEffect(() => {
    const newWS = new WebSocket('http://localhost:3000/')
    // newWS.binaryType = 'arraybuffer'
    newWS.onmessage = onmessage
    newWS.onopen = onopen

    _setWS(newWS)

    return (() => {
      console.log('cleanup')
      newWS.close()
    })
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#faf6f0]">
      <div className="flex flex-col w-full items-center max-w-3xl">
        <div className="flex w-10 aspect-square rounded-lg overflow-hidden">
          <Logo />
        </div>
        <h1 className="text-2xl font-semibold text-center text-[#8c6d3f]">Rill</h1>
        <div className='w-full'>
          <EditorWidget ydoc={ydoc} docKey='uuidhere' />
        </div>
      </div>
    </main>
  )
}

function Logo({ className }: { className?: string }) {
  return (
    <div className="flex flex-col rounded-lg items-center gap-2 bg-amber-700">
      <img src={RillLogo} alt="Rill Logo" className={className} />
    </div>
  )
}
