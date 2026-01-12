import { useEffect, useState } from "react"
import { useNotesStore } from "@renderer/stores/useNotesStore"
import NotesMenu from "./NotesMenu/NotesMenu"
import LineDivider from "../Helper/LineDivider"
import NotesBar from "./NotesBar"
import Tiptap from "./Tiptap"
import TimeCreated from "./TimeCreated"
import { OverlayScrollbarsComponent } from "overlayscrollbars-react"

interface Notes {
    id: number
    html_content: string
    last_date_edited: string
    date_created: string
}

const Notes = (): JSX.Element => {
    const notesObj = useNotesStore((state:any) => state.notesObj)
    const setNotesObj = useNotesStore((state:any) => state.setNotesObj)
    const globalEditor = useNotesStore((state:any) => state.globalEditor)
    const [data, setData] = useState<Array<Notes>>([])

    // fetch the list of notes associated with file id
    useEffect(() => {
        if (notesObj.file_id) {
            const result = window.api.getNotes(notesObj.file_id)
            setData(result)

            // reset tiptap editor if data is empty
            if (result.length === 0) {
                setNotesObj({...notesObj, note_id: null, setHtml: null, dateEdited: null, dateCreated: null})
                globalEditor.commands.setContent("")
            }
        }
    }, [notesObj.file_id])

    
    return (
        <div className="notes-container">
            <NotesMenu data={data}/>
            <LineDivider mode="vertical"/>
            <div className="notes-right">
                <NotesBar file_id={notesObj.file_id} setData={setData}/>
                <LineDivider mode="horizontal"/>
                <OverlayScrollbarsComponent className="tiptap-container" options={{ scrollbars: {autoHide: 'scroll'} }}>
                    <TimeCreated />
                    <Tiptap setData={setData}/>
                </OverlayScrollbarsComponent>
            </div>
        </div>
    )
}

export default Notes