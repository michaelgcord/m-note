import bold from "../../assets/icons/bold.svg"
import italic from "../../assets/icons/italic.svg"
import underline from "../../assets/icons/underline.svg"
import strikethrough from "../../assets/icons/strikethrough.svg"
import heading from "../../assets/icons/heading.svg"
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
    }

    return (
        <div className="notes-bar">
            <img className="notes-bar-icon" onClick={(() => handleClick('bold'))} src={bold} alt="" height={18}/>
            <img className="notes-bar-icon" onClick={(() => handleClick('italic'))} src={italic} alt="" height={18}/>
            <img className="notes-bar-icon" onClick={(() => handleClick('underline'))} src={underline} alt="" height={17}/>
            <img className="notes-bar-icon" onClick={(() => handleClick('strike'))} src={strikethrough} alt="" height={18}/>
            <img className="notes-bar-icon" onClick={(() => handleClick('heading'))} src={heading} alt="" height={18}/>
            <div style={{flexGrow: 1}}></div>
            <div style={{paddingRight: '12px'}}>Start Session Icon</div>
            <div>Focus | Break</div>
        </div>
    )
}

export default NotesBar