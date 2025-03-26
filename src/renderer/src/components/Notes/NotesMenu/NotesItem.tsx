import { useNotesStore } from "@renderer/stores/useNotesStore"
import { useEffect, useState } from "react"
import { convert } from 'html-to-text'
import { EditorState } from 'prosemirror-state';

interface NotesItemProps {
    id: number
    html_content: string // prob need to change this to correct data
    last_date_edited: string
}

const NotesItem = ({id, html_content, last_date_edited} : NotesItemProps) : JSX.Element => {
    const notesObj = useNotesStore((state:any) => state.notesObj)
    const setNotesObj = useNotesStore((state:any) => state.setNotesObj)
    const globalEditor = useNotesStore((state:any) => state.globalEditor)
    const [html, setHtml] = useState<string>(html_content)
    const [date, setDate] = useState<string>(last_date_edited)
    const [name, setName] = useState<string>('New Note')
    const [description, setDescription] = useState<string>('No Additional Text')
    const [firstRender, setFirstRender] = useState<boolean>(true)

    const getNameAndDescription = (html: string) => {
        let text = convert(html, {
            wordwrap: false,
            selectors: [
                {
                    selector: 'h1',
                    options: {uppercase: false}
                }
            ],
        })
        let lines = text.split('\n')
        let first = ""
        let second = ""
        for (let i = 0; i < lines.length; i++) {
            if (lines[i] == "") { // all empty strings are skipped
                continue
            }
            if (first) { // set second string only after first is found
                second = lines[i]
                setDescription(second)
                return
            }
            first = lines[i] // set the first string we see to first
            setName(first)
        }
        if (first === "") {
            setName('New Note')
        }
        if (second === "") {
            setDescription('No Additional Text')
        }
        return
    }

    const getDate = () => {
        const currentDate = new Date().toLocaleDateString('en-US')
        const lastDate = new Date(date).toLocaleDateString('en-US')

        if (currentDate === lastDate) {
            setDate(new Date(date).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }))
        } else {
            setDate(lastDate)
        }
    }

    // on note update
    useEffect(() => {
        if (firstRender) {
            getDate()
            setFirstRender(false)
        }
        // We have to filter through html content to find the name and description
        getNameAndDescription(html)
    }, [html])

    // Set note id and render its content into editor
    const handleClick = () => {
        setNotesObj({...notesObj, note_id: id, setHtml: setHtml, setDate: setDate})
        globalEditor.commands.setContent(html)

        // Reset tiptap state to start a new fresh history
        const newEditorState = EditorState.create({
            doc: globalEditor.state.doc,
            plugins: globalEditor.state.plugins,
            schema: globalEditor.state.schema
        })
        globalEditor.view.updateState(newEditorState);

        console.log('Note id has been set.')
    }

    return (
        <div onClick={handleClick} className="notes-menu-item">
            <div className="note-name">{name}</div>
            <div className="note-date">{date} <span className="note-description">{description}</span></div>
        </div>
    )
}

export default NotesItem