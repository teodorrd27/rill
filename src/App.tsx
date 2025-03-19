import RillLogo from '@/assets/rill-logo.png'
import Document from '@tiptap/extension-document'
import Text from '@tiptap/extension-text'
import Paragraph from '@tiptap/extension-paragraph'
import Placeholder from '@tiptap/extension-placeholder'

import { EditorContent, useEditor } from '@tiptap/react'
import { FC } from 'react'

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
          <Editor />
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

const Editor: FC = () => {
  const editor = useEditor({
    extensions: [
      Document,
      Text,
      Paragraph,
      Placeholder.configure({
        placeholder: 'Add text'
      })
    ],
    content: ``,
  })
  return (
    <EditorContent editor={editor} />
  )
}
