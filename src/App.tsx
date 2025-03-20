import RillLogo from '@/assets/rill-logo.png'

import { useContext, useEffect, useState } from 'react'

import { EditorWidget } from './tiptap.widget'
import { Button } from './components/ui/button'
import { Plus } from 'lucide-react'
import { WebSocketContext } from './providers/WebSocketContext'
import { v4 as uuidv4 } from 'uuid'

export default function Home() {
  // This should be defined if we're sandwiched inside the provider
  const { ydoc, updateCounter } = useContext(WebSocketContext)!

  const [keys, setKeys] = useState<string[]>([])

  useEffect(() => {
    const newKeys: string[] = []
    for (const key of ydoc.getMap('root').keys()) {
      console.log('pushing keys')
      newKeys.push(key)
    }
    console.log(newKeys)
    setKeys(newKeys)
  }, [ydoc, updateCounter])


  const handleAddWidget = () => {
    const newKey = uuidv4()
    console.log('adding ', newKey)
    setKeys((prevKeys) => [...prevKeys, newKey]);
  }

  const handleRemoveWidget = (key: string) => {
    console.log('deleting ', key)
    setKeys((prevKeys) => prevKeys.filter((k) => k !== key));
    ydoc.getMap('root').delete(key)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#faf6f0]">
      <div className="flex flex-col w-full items-center max-w-3xl p-4">
        <div className="flex w-10 aspect-square rounded-lg overflow-hidden">
          <Logo />
        </div>
        <h1 className="text-2xl font-semibold text-center text-[#8c6d3f]">Rill</h1>
        { keys.map(key => (
          <div key={key} className='w-full my-4'>
            <EditorWidget ydoc={ydoc} docKey={key} removeWidgetById={handleRemoveWidget} />
          </div>
        ))}
        <div className="flex justify-center mt-4">
        <Button
          onClick={handleAddWidget}
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
