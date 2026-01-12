// import { useNotesStore } from "@renderer/stores/useNotesStore"
import search from "../../../assets/icons/search-line.svg"
import { useState } from "react"

const NotesTitle = () : JSX.Element => {
    // const notesObj = useNotesStore((state:any) => state.notesObj)
    const [isFocused, setIsFocused] = useState<boolean>(false)

    const handleFocus = () => {
        setIsFocused(true)
    }

    const handleBlur = () => {
        setIsFocused(false)
    }

    return (
        <div className="notes-menu-title drag">
            <div className="search-container">
                <input onFocus={handleFocus} onBlur={handleBlur} placeholder="Search" spellCheck={false} className="search no-drag" type="text" 
                    style={{
                        border: isFocused ? 'solid 1px #749aed' : 'solid 1px #606060'
                    }}
                />
                <img className="search-icon" src={search} alt="" height={21}/>
            </div>
        </div>

    )
}

export default NotesTitle