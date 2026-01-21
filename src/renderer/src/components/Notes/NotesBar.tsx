import noteAdd from "../../assets/icons/note-add.svg"
import deletebin from "../../assets/icons/delete-bin.svg"
import bold from "../../assets/icons/bold.svg"
import italic from "../../assets/icons/italic.svg"
import underline from "../../assets/icons/underline.svg"
import strikethrough from "../../assets/icons/strikethrough.svg"
import heading from "../../assets/icons/heading.svg"
import bulletlist from "../../assets/icons/bullet-list.svg"
import SystemController from "./SystemController"
import { useNotesStore } from "@renderer/stores/useNotesStore"
import { useEffect, useState } from "react"

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

interface NotesBarIconProps {
    height: number
    format: string
    isActive: boolean
}

const NotesBarIcon = ({height, format, isActive} : NotesBarIconProps) => {
    const globalEditor = useNotesStore((state:any) => state.globalEditor)

    const notesClassesOn = "notes-bar-icon-container no-drag"
    const notesClassesOff = "notes-bar-icon-container no-drag no-mouse-events"

    const handleClick = (format: string) => {
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
        <div className={globalEditor ? (globalEditor.isEditable ? notesClassesOn : notesClassesOff) : notesClassesOff} onClick={(() => handleClick(format))} style={{backgroundColor: isActive ? "#eeeeee" : ""}}>
            <img className="notes-bar-icon no-drag" src={format} alt="" height={height}/>
        </div>
    )
}

const NotesBarAddIcon = ({file_id, setData} : NotesBarProps) : JSX.Element => {
    const newNoteObj = useNotesStore((state:any) => state.newNoteObj)
    const setNewNoteObj = useNotesStore((state:any) => state.setNewNoteObj)
    const [isDisabled, setIsDisabled] = useState<boolean>(false)
    const [classNameList, setClassNameList] = useState<string>("")

    const classNameHover = "notes-bar-add-container notes-bar-add-hover no-drag"
    const classNameNoHover = "notes-bar-add-container no-mouse-events no-drag"

    useEffect(() =>{
        if (!isDisabled) {
            setClassNameList(classNameHover)
        } else {
            setClassNameList(classNameNoHover)
        }
    }, [isDisabled])

    // Reenable add button
    useEffect(() => {
        // when the new note has been edited
        if (newNoteObj.wasEdited) { 
            setIsDisabled(false)
        }
        // when new note is deleted
        if (newNoteObj.note_id === null) {
            setIsDisabled(false)
        }
    }, [newNoteObj])

    /**
     * Add note to current file's note list, and disable add icon button
     * until new note has been edited.
     */
    const handleAddNote = () => {
        if (file_id && !isDisabled) {
            const date = new Date().toISOString()
            const note_id = window.api.addNote(file_id, date)

            setNewNoteObj({note_id: note_id, wasEdited: false}) 
            setData(window.api.getNotes(file_id)) // rerender notes list with new note
            setIsDisabled(true) // disable add icon
            console.log('ADD NOTE')
        } else {
            console.log("no file selected")
        }
    }

    return (
        <div className={classNameList}>
            <img className="notes-bar-icon no-drag" style={{opacity: isDisabled ? " 30%" : "100%"}} onClick={handleAddNote} src={noteAdd} alt="" height={20}/>
        </div>
    )
}

const NotesBarDeleteIcon = ({file_id, setData} : NotesBarProps) : JSX.Element => {
    const notesObj = useNotesStore((state:any) => state.notesObj)
    const setNotesObj = useNotesStore((state:any) => state.setNotesObj)
    const newNoteObj = useNotesStore((state:any) => state.newNoteObj)
    const setNewNoteObj = useNotesStore((state:any) => state.setNewNoteObj)
    const globalEditor = useNotesStore((state:any) => state.globalEditor)

    const handleDeleteNote = () => {
        if (file_id && notesObj.note_id) {
            if (notesObj.note_id === newNoteObj.note_id) { // reenable add icon if the new note was deleted
                setNewNoteObj({note_id: null, wasEdited: false})
            }
            window.api.deleteNote(notesObj.note_id)
            setData(window.api.getNotes(file_id))
            setNotesObj({...notesObj, note_id: null})
            if (globalEditor) {
                globalEditor.commands.clearContent(false)
            }
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
    const globalEditorState = useNotesStore((state:any) => state.globalEditorState)

    return (
        <div className="notes-bar drag">
            <div className="notes-bar-side-group-1">
                <NotesBarAddIcon file_id={file_id} setData={setData}/>
                <NotesBarDeleteIcon file_id={file_id} setData={setData}/>
            </div>
            <div className="notes-bar-middle-group">
                <NotesBarIcon format={bold} height={18} isActive={globalEditorState.isBold}/>
                <NotesBarIcon format={italic} height={18} isActive={globalEditorState.isItalic}/>
                <NotesBarIcon format={underline} height={17} isActive={globalEditorState.isUnderline}/>
                <NotesBarIcon format={strikethrough} height={18} isActive={globalEditorState.isStrike}/>
                <NotesBarIcon format={heading} height={18} isActive={globalEditorState.isHeading1}/>
                <NotesBarIcon format={bulletlist} height={17} isActive={globalEditorState.isBulletList}/>
            </div>
            <div className="notes-bar-side-group-2">
                <SystemController/>
            </div>
        </div>
    )
}

export default NotesBar