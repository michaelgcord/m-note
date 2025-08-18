import { Ref } from "react"
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
    buttonClicked: boolean
    addFileRef: Ref<any> 
    addFolderRef: Ref<any>
}

interface HighlightObj {
    show: boolean
    leftClickID: number | null
    highlightID: number | null
}

interface MouseFolderObj {
    id: number | null
    parent_id: number | null
    setParentData: React.Dispatch<React.SetStateAction<Folder[]>> | null
    name: string | null
    type: string | null 
}

interface MouseObj {
    folder: MouseFolderObj
    isDragging: boolean
    isHoveringFileItem: boolean
    x: number
    y: number
}

export const useFileMenuStore = create((set) => ({
    // Global obj to control input events
    inputObj: {show: false, id: null, type: 'folder', buttonClicked: true, addFileRef: null, addFolderRef: null},
    setInputObj: (value : InputObj) => {set({ inputObj: value })},

    // Global obj to control highlight events
    highlightObj: {show: true, leftClickID: null, hoverID: null},
    setHighlightObj: (value : HighlightObj) => {set({ highlightObj: value })},

    // Global Obj to control mouse events
    mouseObj: {
        folder: {
            id: null, 
            parent_id: null, 
            setParentData: null, 
            name: 'n/a', 
            type: null
        }, 
        isDragging: false,
        isHoveringFileItem: false,
        x: 0, 
        y: 0
    },
    setMouseObj: (value : MouseObj) => {set({ mouseObj: value })}
}))