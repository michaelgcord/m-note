import { EditorContent, useEditor } from '@tiptap/react'
import { Extension } from '@tiptap/core'
import Document from '@tiptap/extension-document'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import FileHandler from '@tiptap-pro/extension-file-handler'
import { useEffect, useState } from 'react'
import { useNotesStore } from '@renderer/stores/useNotesStore'

const Tab = Extension.create({
	name: 'Tab',
	addKeyboardShortcuts() {
	  return {
		Tab: () => {
		  return this.editor.commands.insertContent('\t')
		}
	  }
	}
  })

const CustomDocument = Document.extend({
	content: 'heading block*',
  })

const Tiptap = () : JSX.Element => {
    const notesObj = useNotesStore((state:any) => state.notesObj)
    const setGlobalEditor = useNotesStore((state:any) => state.setGlobalEditor)

	const editor = useEditor({
		extensions: [
		  CustomDocument, Tab,
		  StarterKit.configure({
			document: false,
			orderedList: false,
			horizontalRule: false,
			blockquote: false,
			codeBlock: false,
		  }),
		  Image.configure({ inline: true, allowBase64: true }),
		  FileHandler.configure({
			allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
			onDrop: (currentEditor, files, pos) => {
			  files.forEach(file => {
				const fileReader = new FileReader()
				fileReader.readAsDataURL(file)
				fileReader.onload = () => {
				  currentEditor.chain().insertContentAt(pos, {
					type: 'image',
					attrs: {
					  src: fileReader.result,
					},
				  }).focus().run()
				}
			  })
			},
			onPaste: (currentEditor, files, htmlContent) => {
			  files.forEach(file => {
				if (htmlContent) {
				  // if there is htmlContent, stop manual insertion & let other extensions handle insertion via inputRule
				  // you could extract the pasted file from this url string and upload it to a server for example
				  console.log(htmlContent) // eslint-disable-line no-console
				  return
				}
	
				const fileReader = new FileReader()
				fileReader.readAsDataURL(file)
				fileReader.onload = () => {
				  currentEditor.chain().insertContentAt(currentEditor.state.selection.anchor, {
					type: 'image',
					attrs: {
					  src: fileReader.result,
					},
				  }).focus().run()
				}
			  })
			},
		  }),
		],
	})

	// Trigger when a new note is selected
    useEffect(() => {
        if (!editor) return
        const onUpdate = () => {
            if (!notesObj.note_id) return
            const html = editor.getHTML()
            const date = new Date()
            var sqlDate = date.toISOString();
            window.api.editNote(notesObj.note_id, sqlDate, html)
            notesObj.setHtml(html)
			const time = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
			console.log(time)
			notesObj.setDate(time)
        }
        editor.on('update', onUpdate)

        return () => {
            editor.off('update', onUpdate)
        }
    }, [editor, notesObj])

    useEffect(() => {
        if (editor) {
            console.log('Editor is set...')
            setGlobalEditor(editor)
        }
    }, [])

    return (
        <EditorContent spellCheck="false" className="tiptap-editor" editor={editor} />
    )
}

export default Tiptap