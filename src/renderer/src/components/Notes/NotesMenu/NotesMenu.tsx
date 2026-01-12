import NotesTitle from "./NotesTitle"
import LineDivider from "@renderer/components/Helper/LineDivider"
import NotesMenuList from "./NotesMenuList"

interface Notes {
    id: number
    html_content: string
    last_date_edited: string
    date_created: string
}

interface NotesMenuProps {
    data: Notes[]
}

const NotesMenu = ({data} : NotesMenuProps) : JSX.Element => {
    return (
        <div className="notes-menu-container">
            <NotesTitle/>
            <LineDivider mode="horizontal"/>
            {data.length === 0
                ? <div className="notes-menu-no-notes unselectable">No Notes</div>
                : <NotesMenuList data={data}/>
            }
        </div>
    )
}

export default NotesMenu