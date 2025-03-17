import { useNotesStore } from "@renderer/stores/useNotesStore"
import { useState } from "react"

interface NotesItemProps {
    id: number
    html_content: string // prob need to change this to correct data
}

const NotesItem = ({id, html_content} : NotesItemProps) : JSX.Element => {
    const notesObj = useNotesStore((state:any) => state.notesObj)
    const setNotesObj = useNotesStore((state:any) => state.setNotesObj)
    const globalEditor = useNotesStore((state:any) => state.globalEditor)
    const [html, setHtml] = useState<string>(html_content)

    // Set note id and render its content into editor
    const handleClick = () => {
        setNotesObj({...notesObj, note_id: id, setHtml: setHtml})
        globalEditor.commands.setContent(html)
        console.log('Note id has been set.')
    }

    return (
        <div onClick={handleClick} className="notes-menu-item">
            <div className="note-name">Lorem Ipsum</div>
            <div className="note-date">3/17/2025 <span className="note-description">More stuff blah blah blah blah</span></div>
        </div>
    )
}

export default NotesItem