import RillLogo from '@/assets/rill-logo.png'

import { useContext } from 'react'

import { EditorWidget } from './tiptap.widget'
import { Button } from './components/ui/button'
import { Plus } from 'lucide-react'
import { WebSocketContext } from './providers/WebSocketContext'

export default function Home() {
  const { ydoc } = useContext(WebSocketContext)!

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
        <div className="flex justify-center mt-4">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full w-8 h-8 p-0 border-[#c8a97e] text-[#8c6d3f] hover:bg-[#f0e6d6] hover:text-[#8c6d3f]"
          title="Add Text Widget"
        >
          <Plus className="h-4 w-4" />
        </Button>
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
