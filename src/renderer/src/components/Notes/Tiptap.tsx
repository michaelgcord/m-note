import { EditorContent, useEditor, useEditorState, Editor } from '@tiptap/react'
import { Extension } from '@tiptap/core'
// import Document from '@tiptap/extension-document'
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

// const CustomDocument = Document.extend({
// 	content: 'heading block*',
//   })

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
    const newNoteObj = useNotesStore((state:any) => state.newNoteObj)
    const setNewNoteObj = useNotesStore((state:any) => state.setNewNoteObj)	
	const [currentNoteId, setCurrentNoteId] = useState<number | null>(null)

	const editor = useEditor({
		editorProps: {
			attributes: {
			class: 'tiptap-editor',
			},
		},		
		extensions: [
		  Tab,
		  StarterKit.configure({
			// document: false,
			trailingNode: false,
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
			isBold: editor.isActive('bold') && editor.isEditable,
			isItalic: editor.isActive('italic') && editor.isEditable,
			isUnderline: editor.isActive('underline') && editor.isEditable,
			isStrike: editor.isActive('strike') && editor.isEditable,
			isHeading1: editor.isActive('heading', {level: 1}) && editor.isEditable,
			isBulletList: editor.isActive('bulletList') && editor.isEditable,
		}),
	})

    useEffect(() => {
		if (!editor) return
        const onUpdate = () => {
			if (!notesObj.note_id) return
				// Update note into database and reflect changes back into notesItem 
				const html = editor.getHTML()
				const date = new Date()
				var sqlDate = date.toISOString();
				window.api.editNote(notesObj.note_id, sqlDate, html)
				notesObj.setHtml(html)

				// Move current note to the front of notesMenuList
				if (notesObj.note_id != currentNoteId) {
					setCurrentNoteId(notesObj.note_id)
					setData(window.api.getNotes(notesObj.file_id))
				}

				// Reenable add icon if the current note is a new note
				if (notesObj.note_id === newNoteObj.note_id) {
					setNewNoteObj({...newNoteObj, wasEdited: true})
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

	useEffect(() => {
		if (editor) {
			if (!notesObj.note_id) {
				editor.setEditable(false, false)
			} else {
				editor.setEditable(true, false)
			}
		}
	}, [notesObj.note_id])

    return (
		<EditorContent spellCheck="false" className='tiptap-editor-container' editor={editor} />
    )
}

export default Tiptap