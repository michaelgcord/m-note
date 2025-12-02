import { useNotesStore } from "@renderer/stores/useNotesStore"

const NotesTitle = () : JSX.Element => {
    const notesObj = useNotesStore((state:any) => state.notesObj)

    return (
        <div className="notes-menu-title drag">
            <div className="notes-title-name">{notesObj.name}</div>
        </div>

    )
}

export default NotesTitle