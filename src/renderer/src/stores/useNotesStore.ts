import {create} from "zustand"
import { Editor } from "@tiptap/react"

interface NotesObj {
    name: string
    file_id: number | null
    note_id: number | null
    setHtml: React.Dispatch<React.SetStateAction<string>> | null
    dateEdited: string | null
    dateCreated: string | null
}

export const useNotesStore = create((set) => ({
    notesObj: {name: 'M Note', file_id: null, note_id: null, setHtml: null, dateEdited: null, dateCreated: null},
    setNotesObj: (value : NotesObj) => {set({notesObj: value})},

    globalEditor: null,
    setGlobalEditor: (value: Editor | null) => {set({globalEditor: value})}
}))