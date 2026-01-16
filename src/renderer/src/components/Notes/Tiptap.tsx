import { EditorContent, useEditor, useEditorState, Editor } from '@tiptap/react'
import { Extension } from '@tiptap/core'
import Document from '@tiptap/extension-document'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import FileHandler from '@tiptap/extension-file-handler'
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

interface Notes {
    id: number
    html_content: string
    last_date_edited: string
    date_created: string
}

interface TiptapProps {
	setData: React.Dispatch<React.SetStateAction<Notes[]>>
}

const Tiptap = ({setData} : TiptapProps) : JSX.Element => {
    const notesObj = useNotesStore((state:any) => state.notesObj)
    const setGlobalEditor = useNotesStore((state:any) => state.setGlobalEditor)
	const setGlobalEditorState = useNotesStore((state:any) => state.setGlobalEditorState)
	const [currentNoteId, setCurrentNoteId] = useState<number | null>(null)

	const editor = useEditor({
		editorProps: {
			attributes: {
			class: 'tiptap-editor',
			},
		},		
		extensions: [
		  CustomDocument, Tab,
		  StarterKit.configure({
			document: false,
			orderedList: false,
			horizontalRule: false,
			blockquote: false,
			codeBlock: false,
			undoRedo: {newGroupDelay: 150}
		  }),
		Image.configure({ inline: true, allowBase64: true }),
		FileHandler.configure({
			allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
			onDrop: (currentEditor, files, pos) => {
			files.forEach(file => {
				const fileReader = new FileReader()

				fileReader.readAsDataURL(file)
				fileReader.onload = () => {
				currentEditor
					.chain()
					.insertContentAt(pos, {
					type: 'image',
					attrs: {
						src: fileReader.result,
					},
					})
					.focus()
					.run()
				}
			})
			},
			onPaste: (currentEditor, files, htmlContent) => {
			files.forEach(file => {
				if (htmlContent) {
				// if there is htmlContent, stop manual insertion & let other extensions handle insertion via inputRule
				// you could extract the pasted file from this url string and upload it to a server for example
				console.log(htmlContent) // eslint-disable-line no-console
				return false
				}

				const fileReader = new FileReader()

				fileReader.readAsDataURL(file)
				fileReader.onload = () => {
				currentEditor
					.chain()
					.insertContentAt(currentEditor.state.selection.anchor, {
					type: 'image',
					attrs: {
						src: fileReader.result,
					},
					})
					.focus()
					.run()
				}
				return
			})
			},
		}),
		],
	})

	const editorState = useEditorState({
		editor,
		// This function will be called every time the editor state changes
		selector: ({ editor }: { editor: Editor }) => ({
		// It will only re-render if the bold or italic state changes
			isBold: editor.isActive('bold'),
			isItalic: editor.isActive('italic'),
			isUnderline: editor.isActive('underline'),
			isStrike: editor.isActive('strike'),
			isHeading1: editor.isActive('heading', {level: 1}),
			isBulletList: editor.isActive('bulletList'),
		}),
	})

	// Update note in database when user types into tiptap editor
    useEffect(() => {
        if (!editor) return
        const onUpdate = () => {
            if (!notesObj.note_id) return
			const html = editor.getHTML()
			const date = new Date()
			var sqlDate = date.toISOString();
			window.api.editNote(notesObj.note_id, sqlDate, html)
			notesObj.setHtml(html)

			console.log(editorState.isBold)

			if (notesObj.note_id != currentNoteId) {
				// Move this note to the front of the notes list
				setCurrentNoteId(notesObj.note_id)
				setData(window.api.getNotes(notesObj.file_id))
			}

        }
        editor.on('update', onUpdate)

        return () => {
            editor.off('update', onUpdate)
        }
    }, [editor, notesObj])

	/**
	 * Set editorState in notes store so other components can subscribe
	 * to state changes. i.e. bold, italic, etc...
	 */
	useEffect(() => {
        if (editor) {
			setGlobalEditorState({
				isBold: editorState.isBold,
				isItalic: editorState.isItalic,
				isUnderline: editorState.isUnderline,
				isStrike: editorState.isStrike,
				isHeading1: editorState.isHeading1,
				isBulletList: editorState.isBulletList,
			})
        }
	}, [editorState])

	// set editor in notes store
    useEffect(() => {
        if (editor) {
            setGlobalEditor(editor)
        }
    }, [])

    return (
		<EditorContent spellCheck="false" className='tiptap-editor-container' editor={editor} />
    )
}

export default Tiptap