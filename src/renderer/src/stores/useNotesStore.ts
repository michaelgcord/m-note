import {create} from "zustand"
import { Editor } from "@tiptap/react"

interface Notes {
    id: number
    html_content: string
    last_date_edited: string
    date_created: string
}

interface NotesObj {
    name: string
    file_id: number | null
    note_id: number | null
    first_note_id: number | null
    setHtml: React.Dispatch<React.SetStateAction<string>> | null
    dateEdited: string | null
    dateCreated: string | null
    isFocused: boolean
    setData: React.Dispatch<React.SetStateAction<Notes[]>> | null
}

interface newNoteObj {
    note_id: number | null
    wasEdited: boolean
}

interface globalEditorState {
    isBold: boolean
    isItalic: boolean
    isUnderline: boolean
    isStrike: boolean
    isHeading1: boolean
    isBulletList: boolean
}

export const useNotesStore = create((set) => ({
    notesObj: {
        name: 'M Note', 
        file_id: null, 
        note_id: null, 
        first_note_id: null, 
        setHtml: null, 
        dateEdited: null, 
        dateCreated: null, 
        isFocused: false,
        setData: null,
    },
    setNotesObj: (value : NotesObj) => {set({notesObj: value})},

    newNoteObj: {
        note_id: null,
        wasEdited: false,
    },
    setNewNoteObj: (value: newNoteObj) => {set({newNoteObj: value})},

    globalEditor: null,
    setGlobalEditor: (value: Editor | null) => {set({globalEditor: value})},
    globalEditorState: {
        isBold: false,
        isItalic: false,
        isUnderline: false,
        isStrike: false,
        isHeading1: false,
        isBulletList: false,        
    },
    setGlobalEditorState: (value: globalEditorState) => {set({globalEditorState: value})},
}))