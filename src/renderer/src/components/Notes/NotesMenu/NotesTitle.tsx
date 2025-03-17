import noteAdd from "../../../assets/icons/note-add.svg"

interface Notes {
    id: number
    html_content: string
}

interface NotesTitleProps {
    name: string
    file_id: number
    setData: React.Dispatch<React.SetStateAction<Notes[]>>
}

const NotesTitle = ({name, file_id, setData} : NotesTitleProps) : JSX.Element => {
    const handleClick = () => {
        if (file_id) {
            window.api.addNote(file_id)
            setData(window.api.getNotes(file_id))
        } else {
            console.log("no file selected")
        }
    }

    return (
        <div className="notes-menu-title">
            <div>{name}</div>
            <div style={{flexGrow: 1}}></div>
            <img onClick={handleClick} src={noteAdd} alt="" height={16}/>
        </div>

    )
}

export default NotesTitle