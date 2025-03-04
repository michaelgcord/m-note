import {create} from "zustand"

interface InputObj {
    show: boolean,
    id: number,
    folder: number
}

const folder = 0
export const useFileMenuStore = create((set) => ({
    // Global states to control input
    inputObj: {show: true, id: null, type: folder},
    setInputObj: (value : InputObj) => {set({ inputObj: value })}
}))