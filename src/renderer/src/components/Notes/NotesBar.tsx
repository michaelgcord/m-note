import noteAdd from "../../assets/icons/note-add.svg"
import deletebin from "../../assets/icons/delete-bin.svg"
import bold from "../../assets/icons/bold.svg"
import italic from "../../assets/icons/italic.svg"
import underline from "../../assets/icons/underline.svg"
import strikethrough from "../../assets/icons/strikethrough.svg"
import heading from "../../assets/icons/heading.svg"
import bulletlist from "../../assets/icons/bullet-list.svg"
import SystemController from "./SystemController"
import Search from "./Search"
import { useNotesStore } from "@renderer/stores/useNotesStore"

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

const NotesBar = ({file_id, setData} : NotesBarProps) : JSX.Element => {
    const globalEditor = useNotesStore((state:any) => state.globalEditor)

    // add a new note to current file
    const handleAddNote = () => {
        if (file_id) {
            window.api.addNote(file_id)
            setData(window.api.getNotes(file_id))
        } else {
            console.log("no file selected")
        }
    }

    const handleClick = (format: string) => {
        if (format === 'bold') {
            globalEditor.chain().focus().toggleBold().run()
        }
        if (format === 'italic') {
            globalEditor.chain().focus().toggleItalic().run()
        }
        if (format === 'underline') {
            globalEditor.chain().focus().toggleUnderline().run()
        }
        if (format === 'strike') {
            globalEditor.chain().focus().toggleStrike().run()
        }
        if (format === 'heading') {
            globalEditor.chain().focus().toggleHeading({ level: 1 }).run()
        }
        if (format === 'bulletlist') {
            globalEditor.chain().focus().toggleBulletList().run()
        }            
    }

    return (
        <div className="notes-bar drag">
            <div className="notes-bar-side-group-1">
                <img className="notes-bar-icon no-drag" onClick={handleAddNote} src={noteAdd} alt="" height={18}/>
                <img className="notes-bar-icon no-drag" src={deletebin} alt="" height={18}/>
            </div>
            <div className="notes-bar-middle-group">
                <img className="notes-bar-icon no-drag" onClick={(() => handleClick('bold'))} src={bold} alt="" height={18}/>
                <img className="notes-bar-icon no-drag" onClick={(() => handleClick('italic'))} src={italic} alt="" height={18}/>
                <img className="notes-bar-icon no-drag" onClick={(() => handleClick('underline'))} src={underline} alt="" height={17}/>
                <img className="notes-bar-icon no-drag" onClick={(() => handleClick('strike'))} src={strikethrough} alt="" height={18}/>
                <img className="notes-bar-icon no-drag" onClick={(() => handleClick('heading'))} src={heading} alt="" height={18}/>
                <img className="notes-bar-icon no-drag" onClick={(() => handleClick('bulletlist'))} src={bulletlist} alt="" height={17}/>
            </div>
            <div className="notes-bar-side-group-2">
                <SystemController/>
            </div>
            {/* <Search/> */}
        </div>
    )
}

export default NotesBar