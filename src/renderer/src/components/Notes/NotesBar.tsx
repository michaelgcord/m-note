import noteAdd from "../../assets/icons/note-add.svg"
import deletebin from "../../assets/icons/delete-bin.svg"
import bold from "../../assets/icons/bold.svg"
import italic from "../../assets/icons/italic.svg"
import underline from "../../assets/icons/underline.svg"
import strikethrough from "../../assets/icons/strikethrough.svg"
import heading from "../../assets/icons/heading.svg"
import bulletlist from "../../assets/icons/bullet-list.svg"
import SystemController from "./SystemController"
// import Search from "./Search"
import { useNotesStore } from "@renderer/stores/useNotesStore"
import { useState } from "react"

interface Notes {
    id: number
    html_content: string
    last_date_edited: string
    date_created: string
}

interface NotesBarProps {
    file_id: number
    setData: React.Dispatch<React.SetStateAction<Notes[]>>
}

const NotesBarIcon = ({height, format}) => {
    const globalEditor = useNotesStore((state:any) => state.globalEditor)
    const [toggle, setToggle] = useState<boolean>(false)

    const handleClick = (format: string) => {
        setToggle(!toggle)

        if (format === bold) {
            globalEditor.chain().focus().toggleBold().run()
        }
        if (format === italic) {
            globalEditor.chain().focus().toggleItalic().run()
        }
        if (format === underline) {
            globalEditor.chain().focus().toggleUnderline().run()
        }
        if (format === strikethrough) {
            globalEditor.chain().focus().toggleStrike().run()
        }
        if (format === heading) {
            globalEditor.chain().focus().toggleHeading({ level: 1 }).run()
        }
        if (format === bulletlist) {
            globalEditor.chain().focus().toggleBulletList().run()
        }            
    }

    return (
        <div className="notes-bar-icon-container no-drag" onClick={(() => handleClick(format))} style={{backgroundColor: toggle ? "#eeeeee" : ""}}>
            <img className="notes-bar-icon no-drag" src={format} alt="" height={height}/>
        </div>
    )
}

const NotesBarAddIcon = ({file_id, setData} : NotesBarProps) : JSX.Element => {
    // add a new note to current file
    const handleAddNote = () => {
        if (file_id) {
            window.api.addNote(file_id)
            setData(window.api.getNotes(file_id))
        } else {
            console.log("no file selected")
        }
    }

    return (
        <div className="notes-bar-add-container no-drag">
            <img className="notes-bar-icon no-drag" onClick={handleAddNote} src={noteAdd} alt="" height={20}/>
        </div>
    )
}

const NotesBarDeleteIcon = ({file_id, setData} : NotesBarProps) : JSX.Element => {
    const notesObj = useNotesStore((state:any) => state.notesObj)

    // TODO: add a confirmation to delete ui
    const handleDeleteNote = () => {
        if (file_id && notesObj.note_id) {
            window.api.deleteNote(notesObj.note_id)
            setData(window.api.getNotes(file_id))
        } else {
            console.log("no file selected")
        }
    }

    return (
        <div className="notes-bar-delete-container no-drag">
            <img className="notes-bar-icon no-drag" onClick={handleDeleteNote} src={deletebin} alt="" height={20}/>
        </div>        
    )
}

const NotesBar = ({file_id, setData} : NotesBarProps) : JSX.Element => {
    return (
        <div className="notes-bar drag">
            <div className="notes-bar-side-group-1">
                <NotesBarAddIcon file_id={file_id} setData={setData}/>
                <NotesBarDeleteIcon file_id={file_id} setData={setData}/>
            </div>
            <div className="notes-bar-middle-group">
                <NotesBarIcon format={bold} height={18}/>
                <NotesBarIcon format={italic} height={18}/>
                <NotesBarIcon format={underline} height={17}/>
                <NotesBarIcon format={strikethrough} height={18}/>
                <NotesBarIcon format={heading} height={18}/>
                <NotesBarIcon format={bulletlist} height={17}/>
            </div>
            <div className="notes-bar-side-group-2">
                <SystemController/>
            </div>
            {/* <Search/> */}
        </div>
    )
}

export default NotesBar