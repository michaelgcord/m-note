import { useEffect, useState } from "react"
import { useNotesStore } from "@renderer/stores/useNotesStore"
import NotesMenu from "./NotesMenu/NotesMenu"
import LineDivider from "../Helper/LineDivider"
import NotesBar from "./NotesBar"
import Tiptap from "./Tiptap"
import TimeCreated from "./TimeCreated"

interface Notes {
    id: number
    html_content: string
    last_date_edited: string
    date_created: string
}

const Notes = (): JSX.Element => {
    const notesObj = useNotesStore((state:any) => state.notesObj)
    const [data, setData] = useState<Array<Notes>>([]) 

    // fetch the list of notes associated with file id
    useEffect(() => {
        if (notesObj.file_id) {
            setData(window.api.getNotes(notesObj.file_id))
        }
    }, [notesObj.file_id])

    
    return (
        <div className="notes-container">
            <NotesMenu data={data}/>
            <LineDivider mode="vertical"/>
            <div className="notes-right">
                <NotesBar file_id={notesObj.file_id} setData={setData}/>
                <LineDivider mode="horizontal"/>
                <TimeCreated />
                <Tiptap />
            </div>
        </div>
    )
}

export default Notes