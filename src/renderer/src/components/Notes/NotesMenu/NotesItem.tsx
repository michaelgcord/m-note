import { useNotesStore } from "@renderer/stores/useNotesStore"
import { useEffect, useState } from "react"
import { convert } from 'html-to-text'
import { EditorState } from 'prosemirror-state';

interface NotesItemProps {
    id: number
    html_content: string // prob need to change this to correct data
    last_date_edited: string
    date_created: string
}

const NotesItem = ({id, html_content, last_date_edited, date_created} : NotesItemProps) : JSX.Element => {
    const notesObj = useNotesStore((state:any) => state.notesObj)
    const setNotesObj = useNotesStore((state:any) => state.setNotesObj)
    const globalEditor = useNotesStore((state:any) => state.globalEditor)
    const [html, setHtml] = useState<string>(html_content)
    const [name, setName] = useState<string>('New Note')
    const [description, setDescription] = useState<string>('No Additional Text')
    const [firstRender, setFirstRender] = useState<boolean>(true)
    const [time, setTime] = useState<string>("")

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
        // can be reoptimized later by checking if minutes are the same
        const currentDate = new Date().toLocaleString('en-US')
        // Time will always be the current date
        setTime(new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }))
        setNotesObj({...notesObj, dateEdited: currentDate})
    }

    // on note update, set rerender note's date, name, and description
    useEffect(() => {
        if (firstRender) { // skip get date on first render
            setFirstRender(false)
            getNameAndDescription(html)
            return
        }
        // We have to filter through html content to find the name and description
        getDate()
        getNameAndDescription(html)
    }, [html])

    // on first render initialize date for note
    useEffect(() => {
        const initializeDate = () => {
            const currentDate = new Date().toLocaleDateString('en-US')
            const lastDate = new Date(last_date_edited).toLocaleDateString('en-US')
            if (currentDate === lastDate) {
                setTime(new Date(last_date_edited).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }))
            } else {
                setTime(lastDate)
            }
        }
        initializeDate()
    }, [])

    // on first render, select note if it's the first in its list
    useEffect(() => {
        if (id === notesObj.first_note_id) {
            handleClick(false) // set isFocused to false to prevent note stutter
        }
    }, [])

    // Set note id and render its content into editor when note is clicked
    const handleClick = (focus:boolean) => {
        setNotesObj({...notesObj, note_id: id, setHtml: setHtml, dateEdited: last_date_edited, dateCreated: date_created, isFocused: focus})
        globalEditor.commands.setContent(html, {emitUpdate: false})

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
        <div className="notes-menu-item unselectable" onClick={() => handleClick(true)}>
            <div className="note-name">{name}</div>
            <div className="note-date">{time} <span className="note-description">{description}</span></div>
            <div className="notes-menu-item-background"
                style={{backgroundColor: (notesObj.note_id === id && notesObj.isFocused) ? "#749aed" : notesObj.note_id === id ? "#c3c3c3" : ""}}
            />
        </div>
    )
}

export default NotesItem