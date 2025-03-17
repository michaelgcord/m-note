import {create} from "zustand"

/* Global State to control which menu to display:
    1. calendar
    2. notes
    3. data
*/
export const useMenuStore = create((set) => ({
    menu: 'notes',
    setMenu: (value:string) => {set({ menu: value })},
}))