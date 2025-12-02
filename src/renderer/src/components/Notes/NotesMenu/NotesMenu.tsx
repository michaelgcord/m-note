import { useNotesStore } from "@renderer/stores/useNotesStore"
import { useEffect, useRef } from "react"
import NotesItem from "./NotesItem"
import NotesTitle from "./NotesTitle"
import LineDivider from "@renderer/components/Helper/LineDivider"
import { OverlayScrollbarsComponent } from "overlayscrollbars-react"

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
    const notesObj = useNotesStore((state:any) => state.notesObj)
    const setNotesObj = useNotesStore((state:any) => state.setNotesObj)
    const notesMenuListRef = useRef<any>(null)

    // turns notes-item background to grey when user clicks out of notes-menu-list
    useEffect(() => {
        const handleClickOutside = (event:any) =>{
            if (notesMenuListRef && !notesMenuListRef.current.contains(event.target)) {
                setNotesObj({...notesObj, isFocused: false})
            }
        }
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        }        
    }, [notesMenuListRef, notesObj])

    return (
        <div className="notes-menu-container">
            <NotesTitle/>
            <LineDivider mode="horizontal"/>
            <OverlayScrollbarsComponent className="notes-menu-list" options={{ scrollbars: {autoHide: 'scroll'} }}>
                <div ref={notesMenuListRef}>
                    {data.map((item, index) => {
                        return (
                            <div key={item.id}>
                                <NotesItem 
                                    id={item.id}
                                    html_content={item.html_content}
                                    last_date_edited={item.last_date_edited}
                                    date_created={item.date_created}
                                />
                                {index === data.length - 1
                                    ? <></>
                                    : <hr className="notes-divider"/>
                                }
                            </div>
                        )
                    })}
                </div>
            </OverlayScrollbarsComponent>
        </div>
    )
}

export default NotesMenu