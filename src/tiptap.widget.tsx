import Document from '@tiptap/extension-document'
import Text from '@tiptap/extension-text'
import Paragraph from '@tiptap/extension-paragraph'
import Placeholder from '@tiptap/extension-placeholder'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Heading from '@tiptap/extension-heading'
import ListItem from '@tiptap/extension-list-item'
import BulletList from '@tiptap/extension-bullet-list'
import History from '@tiptap/extension-history'
// import OrderedList from '@tiptap/extension-ordered-list'

import { Button } from '@/components/ui/button'

import { Bold as BoldIcon, Italic as ItalicIcon, List, 
  // ListOrdered,
  Heading1, Heading2, Undo, Redo, Trash2 } from 'lucide-react'

import * as Y from 'yjs'
import { FC, useEffect } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import { ySyncPlugin } from 'y-prosemirror'

interface IEditorWidget {
  ydoc: Y.Doc
  docKey: string
  removeWidgetById: (id: string) => void
}

export const EditorWidget: FC<IEditorWidget> = ({ydoc, docKey, removeWidgetById}) => {
  const editor = useEditor({
    extensions: [
      Document,
      Text,
      Paragraph,
      Italic,
      Bold,
      ListItem,
      BulletList,
      History,
      // OrderedList,
      Placeholder.configure({
        placeholder: 'Add text'
      }),
      Heading.configure({
        levels: [1, 2],
      })
    ],
    content: ``,
  })

  useEffect(() => {
    console.log('hitting this')
    const mapRef = ydoc.getMap<Y.XmlFragment>('root')
    const xmlFragment = mapRef.has(docKey) ? mapRef.get(docKey)! : mapRef.set(docKey, new Y.XmlFragment())
    const yPlugin = ySyncPlugin(xmlFragment)
    if (editor && !Object.prototype.hasOwnProperty.call(editor.state, 'y-sync$')) {
      console.log('registering ysync')
      editor.registerPlugin(yPlugin)
    }
  },)

  if (!editor) {
    return null
  }

  const toggleBold = () => {
    editor.chain().focus().toggleBold().run()
  }
  const toggleItalic = () => {
    editor.chain().focus().toggleItalic().run()
  }
  const toggleHeading = (level: 1 | 2) => {
    editor.chain().focus().toggleHeading({ level }).run()
  }
  const toggleBulletList = () => {
    editor.chain().focus().toggleBulletList().run()
  }
  // TODO: This doesn't behave as expected. Makes things disappear. Possibly because of YJS incompatibility.
  // const toggleOrderedList = () => {
  //   editor.chain().focus().toggleOrderedList().run()
  // }

  return (
    <div className='relative editor-widget rounded-md border border-[#c8a97e] bg-[#fdfbf7] p-4 shadow-sm'>
      <div className='toolbar flex flex-wrap gap-1 mb-2 pb-2 border-b border-[#e9dcc8]'>
        <Button selected={editor.isActive('bold')} onClick={toggleBold} variant='ghost' size='sm' className='text-[#8c6d3f]'>
          <BoldIcon className='h-4 w-4' />
        </Button>
        <Button selected={editor.isActive('italic')} onClick={toggleItalic} variant='ghost' size='sm' className='text-[#8c6d3f]'>
          <ItalicIcon className='h-4 w-4' />
        </Button>
        <Button selected={editor.isActive('heading', { level: 1 })} onClick={() => toggleHeading(1)} variant='ghost' size='sm' className='text-[#8c6d3f]'>
          <Heading1 className='h-4 w-4' />
        </Button>
        <Button selected={editor.isActive('heading', { level: 2 })} onClick={() => toggleHeading(2)} variant='ghost' size='sm' className='text-[#8c6d3f]'>
          <Heading2 className='h-4 w-4' />
        </Button>
        <Button selected={editor.isActive('bulletList')} onClick={toggleBulletList} variant='ghost' size='sm' className='text-[#8c6d3f]'>
          <List className='h-4 w-4' />
        </Button>
        {/* <Button selected={editor.isActive('orderedList')} onClick={toggleOrderedList} variant='ghost' size='sm' className='text-[#8c6d3f]'>
          <ListOrdered className='h-4 w-4' />
        </Button> */}
        <div className='ml-auto flex gap-1'>
          <Button disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()} variant='ghost' size='sm' className='text-[#8c6d3f]'>
            <Undo className='h-4 w-4' />
          </Button>
          <Button disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()} variant='ghost' size='sm' className='text-[#8c6d3f]'>
            <Redo className='h-4 w-4' />
          </Button>
        </div>
      </div>
      <div className='editor-content min-h-[150px] p-2 focus-within:outline-none tiptap' contentEditable={false}>
        <EditorContent editor={editor} />
      </div>
      <Button
          onClick={() => removeWidgetById(docKey)}
          variant='ghost'
          size='sm'
          className='absolute bottom-2 right-2 text-[#8c6d3f] hover:bg-[#f0e6d6] hover:text-[#8c6d3f]'
          title='Remove widget'
        >
          <Trash2 className='h-4 w-4' />
        </Button>
    </div>
  )
}
