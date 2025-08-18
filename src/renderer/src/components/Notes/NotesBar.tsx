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


const NotesBar = () : JSX.Element => {
    const globalEditor = useNotesStore((state:any) => state.globalEditor)

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
            <img className="notes-bar-icon no-drag" src={deletebin} alt="" height={18}/>
            <div className="notes-bar-spacer"></div>
            <img className="notes-bar-icon no-drag" onClick={(() => handleClick('bold'))} src={bold} alt="" height={18}/>
            <img className="notes-bar-icon no-drag" onClick={(() => handleClick('italic'))} src={italic} alt="" height={18}/>
            <img className="notes-bar-icon no-drag" onClick={(() => handleClick('underline'))} src={underline} alt="" height={17}/>
            <img className="notes-bar-icon no-drag" onClick={(() => handleClick('strike'))} src={strikethrough} alt="" height={18}/>
            <img className="notes-bar-icon no-drag" onClick={(() => handleClick('heading'))} src={heading} alt="" height={18}/>
            <img className="notes-bar-icon no-drag" onClick={(() => handleClick('bulletlist'))} src={bulletlist} alt="" height={17}/>
            <Search/>
            <div className="system-controls-container">
                <SystemController/>
            </div>
        </div>
    )
}

export default NotesBar