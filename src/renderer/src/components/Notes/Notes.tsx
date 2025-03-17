import NotesMenu from "./NotesMenu/NotesMenu"
import LineDivider from "../Helper/LineDivider"
import NotesBar from "./NotesBar"
import Tiptap from "./Tiptap"

const Notes = (): JSX.Element => {
    return (
        <div className="notes-container">
            <NotesMenu/>
            <LineDivider mode="vertical"/>
            <div className="notes-right">
                <NotesBar />
                <LineDivider mode="horizontal"/>
                <Tiptap />
            </div>
        </div>
    )
}

export default Notes