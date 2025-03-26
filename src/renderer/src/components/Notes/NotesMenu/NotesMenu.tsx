import { useNotesStore } from "@renderer/stores/useNotesStore"
import { useEffect, useState } from "react"
import NotesItem from "./NotesItem"
import NotesTitle from "./NotesTitle"
import LineDivider from "@renderer/components/Helper/LineDivider"

interface Notes {
    id: number
    html_content: string
    last_date_edited: string
}

const NotesMenu = () : JSX.Element => {
    const notesObj = useNotesStore((state:any) => state.notesObj)
    const [data, setData] = useState<Array<Notes>>([])

    // fetch the list notes associated with file id
    useEffect(() => {
        if (notesObj.file_id) {
            setData(window.api.getNotes(notesObj.file_id))
        }
    }, [notesObj.file_id])

    return (
        <div className="notes-menu-container">
            <NotesTitle name={notesObj.name} file_id={notesObj.file_id} setData={setData}/>
            <LineDivider mode="horizontal"/>
            {data.map((item) => {
                return (
                    <div key={item.id}>
                        <NotesItem 
                            id={item.id}
                            html_content={item.html_content}
                            last_date_edited={item.last_date_edited}
                        />
                    </div>
                )
            })}
        </div>
    )
}

export default NotesMenu