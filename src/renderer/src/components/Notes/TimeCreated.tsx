import { useState } from 'react'
import { useNotesStore } from '@renderer/stores/useNotesStore'

const TimeCreated = () : JSX.Element => {
    const notesObj = useNotesStore((state:any) => state.notesObj)
    const dateCreated = new Date(notesObj.dateCreated)
    const dateEdited = new Date(notesObj.dateEdited)

    const createdDate = dateCreated.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    const createdTime = dateCreated.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    const editedDate = dateEdited.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    const editedTime = dateEdited.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

    const createdText = "Created: " + createdDate + " at " + createdTime
    const editedText = editedDate + " at " + editedTime

    const [toggleText, setToggleText] = useState<boolean>(false)

    const toggle = () => {
        setToggleText(!toggleText)
    }

    return (
        <div className='tiptap-time unselectable'>
            {notesObj.note_id ?
                <div onClick={toggle}>
                    {toggleText 
                        ? editedText
                        : createdText
                    }
                </div>
                : <></>
            }  
        </div>
    )
}

export default TimeCreated