import {create} from "zustand"

interface Folder {
    id: number
    parent_id: number | null
    name: string
    type: string
    open: number
}

interface InputObj {
    show: boolean
    id: number
    type: string
}

interface HighlightObj {
    leftClickID: number | null
}

interface MouseObj {
    id: number | null
    parent_id: number | null
    setParentData: React.Dispatch<React.SetStateAction<Folder[]>> | null
    name: string
    isDragging: boolean
    x: number
    y: number
}

export const useFileMenuStore = create((set) => ({
    // Global obj to control input
    inputObj: {show: false, id: null, type: 'folder'},
    setInputObj: (value : InputObj) => {set({ inputObj: value })},

    // Global obj to control highlight
    highlightObj: {leftClickID: null},
    setHighlightObj: (value : HighlightObj) => {set({ highlightObj: value })},

    // Global Obj to control mouse events
    mouseObj: {id: null, parent_id: null, setParentData: null, name: 'n/a', isDragging: false, x: 0, y: 0},
    setMouseObj: (value : MouseObj) => {set({ mouseObj: value })}
}))