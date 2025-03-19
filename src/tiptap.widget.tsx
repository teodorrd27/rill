import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Undo, Redo } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Editor } from './components/editor'

import type * as Y from 'yjs'
import { FC } from 'react'

interface IEditorWidget {
  ydoc: Y.Doc
  docKey: string
}

export const EditorWidget: FC<IEditorWidget> = ({ydoc, docKey}) => {
  return (
    <div className="editor-widget rounded-md border border-[#c8a97e] bg-[#fdfbf7] p-4 shadow-sm">
      <div className="toolbar flex flex-wrap gap-1 mb-2 pb-2 border-b border-[#e9dcc8]">
        <Button variant="ghost" size="sm" className="text-[#8c6d3f]">
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="text-[#8c6d3f]">
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="text-[#8c6d3f]">
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="text-[#8c6d3f]">
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="text-[#8c6d3f]">
          <List className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="text-[#8c6d3f]">
          <ListOrdered className="h-4 w-4" />
        </Button>
        <div className="ml-auto flex gap-1">
          <Button variant="ghost" size="sm" className="text-[#8c6d3f]">
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-[#8c6d3f]">
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="editor-content min-h-[150px] p-2 focus-within:outline-none" contentEditable={false}>
        <Editor ydoc={ydoc} docKey={docKey} />
      </div>
    </div>
  )
}
