import { FC, useEffect } from 'react'
import { ySyncPlugin } from 'y-prosemirror'
import type * as Y from 'yjs'
import { EditorContent, useEditor } from '@tiptap/react'

import Document from '@tiptap/extension-document'
import Text from '@tiptap/extension-text'
import Paragraph from '@tiptap/extension-paragraph'
import Placeholder from '@tiptap/extension-placeholder'

interface IEditor {
  ydoc: Y.Doc,
  docKey: string
}

export const Editor: FC<IEditor> = ({ydoc, docKey}) => {
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

  useEffect(() => {
    const yPlugin = ySyncPlugin(ydoc.getXmlFragment(docKey))
    if (editor && !Object.prototype.hasOwnProperty.call(editor.state, 'y-sync$')) {
      editor.registerPlugin(yPlugin)
    }
    editor?.chain().focus()
  })
  return (
    <EditorContent editor={editor} />
  )
}
