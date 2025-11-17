import arrowDown from "../../assets/icons/arrow-down.svg"
import arrowRight from "../../assets/icons/arrow-right.svg"
import file from "../../assets/icons/file.svg"
import dots from "../../assets/icons/more-fill.svg"
import { useFileMenuStore } from "@renderer/stores/useFileMenuStore"
import { useNotesStore } from "@renderer/stores/useNotesStore"
import { useEffect, useState } from "react"

interface Folder {
    id: number
    parent_id: number | null
    name: string
    type: string
    open: number
}

interface FileMenuNameProps {
    id: number
    parent_id: number | null
    setParentData: React.Dispatch<React.SetStateAction<Folder[]>>
    type: string
    name: string
    open: number
    setOpen: React.Dispatch<React.SetStateAction<number>>,
    padding: number
    setShowRename: React.Dispatch<React.SetStateAction<boolean>>
}

interface Move {
    x: number
    y: number
    isLeftMouseDown: boolean
}

const FileMenuName = ({id, parent_id, setParentData, type, name, open, setOpen, padding, setShowRename} : FileMenuNameProps) : JSX.Element => {
    const inputObj = useFileMenuStore((state:any) => state.inputObj)
    const setInputObj = useFileMenuStore((state:any) => state.setInputObj)
    const highlightObj = useFileMenuStore((state:any) => state.highlightObj)
    const setHighlightObj = useFileMenuStore((state:any) => state.setHighlightObj)
    const mouseObj = useFileMenuStore((state:any) => state.mouseObj)
    const setMouseObj = useFileMenuStore((state:any) => state.setMouseObj)
    const contextMenuObj = useFileMenuStore((state:any) => state.contextMenuObj)
    const setContextMenuObj = useFileMenuStore((state:any) => state.setContextMenuObj)
    const [checkMove, setCheckMove] = useState<Move>({x: 0, y: 0, isLeftMouseDown: false})
    const [wasDragging, setWasDragging] = useState<boolean>(false)

    const notesObj = useNotesStore((state:any) => state.notesObj)
    const setNotesObj = useNotesStore((state:any) => state.setNotesObj)

    const [showDots, setShowDots] = useState<boolean>(false)
    const nameWidth = (165 - padding) + 'px'

    // reset check move on mouse up
    useEffect(() => {
        const reset = () => {
            setCheckMove({...checkMove, isLeftMouseDown: false})
        }
        window.addEventListener('mouseup', reset)
        return () => {
            removeEventListener('mouseup', reset)
        }
    }, [])

    // open folder when adding new folder or file to folder
    useEffect(() => {
        if (id === inputObj.id && inputObj.show) {
            setOpen(1)
            window.api.editFolder(parent_id, name, 1, id)
        }
    }, [inputObj.show])

    // toggle folders to open and close
    const toggleOpen = () => {
        if (type === 'file' || wasDragging) return // no need to toggle for files
        if (open === 1) {
            setOpen(0)
            window.api.editFolder(parent_id, name, 0, id)
        } else {
            setOpen(1)
            window.api.editFolder(parent_id, name, 1, id)
        }
    }

    // mount input to appropriate folder and highlight folder when clicked
    const selectFolder = () => {
        if (wasDragging) return
        if (type === 'folder') {
            setInputObj({...inputObj, id: id})
        } else { // if file is selected, mount input to its parent folder
            setInputObj({...inputObj, id: parent_id})
        }
        setHighlightObj({...highlightObj, leftClickID: id})
    }

    const handleClick = () => {
        if (contextMenuObj.showContext) return // don't trigger when context menu is open
        toggleOpen()
        selectFolder()

        // select file and fetch notes associated to file id inside notes menu
        if (type === 'file') {
            setNotesObj({...notesObj, name: name, file_id: id})
        }
    }

    const setMouse = () => {
        setMouseObj({...mouseObj, isDragging: true, folder: {id: id, parent_id: parent_id, setParentData: setParentData, name: name, type: type}})
    }

    const handleMouseDown = (e:any) => {
        if (e.button === 2) return // return on right click
        setCheckMove({...checkMove, isLeftMouseDown: true, x: mouseObj.x, y: mouseObj.y})
        setWasDragging(false)
    }

    // show mouse folder after mouse is dragged across a certain range
    const handleMouseMove = () => {
        if (checkMove.isLeftMouseDown) {
            const range = 3
            if (
                (mouseObj.x > checkMove.x + range) ||
                (mouseObj.x < checkMove.x - range) ||
                (mouseObj.y > checkMove.y + range) ||
                (mouseObj.y < checkMove.y - range)
            ) {
                setMouse()
                setWasDragging(true)
            }
        }
    }

    const handleMouseOver = () => {
        setMouseObj({...mouseObj, isHoveringFileItem: true})
        setShowDots(true)

        // if folder is already a subfolder of mouseObj, dont highlight
        if (window.api.checkSubFolders(mouseObj.folder.id, id)) {
            setHighlightObj({...highlightObj, show: false})
            return
        }

        if (type === 'file') {
            setHighlightObj({...highlightObj, show: true, hoverID: parent_id})
        }
        if (type === 'folder') {
            setHighlightObj({...highlightObj, show: true, hoverID: id})
        }
    }

    const handleMouseLeave = () => {
        setMouseObj({...mouseObj, isHoveringFileItem: false})
        setShowDots(false)
    }

    const handleContextMenu = () => {
        // set context menu object
        setContextMenuObj({id: id, parent_id: parent_id, setParentData: setParentData, showContext: true, setShowRename: setShowRename})
    }

    return (
        <div 
            onClick={handleClick} 
            onMouseDown={handleMouseDown} 
            onMouseMove={handleMouseMove} 
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseLeave}
            onContextMenu={handleContextMenu}
            className="file-menu-name-container unselectable" 
            style={{paddingLeft: padding + 'px', backgroundColor: highlightObj.leftClickID === id ? "#585858" : ""}}
        >
            {type === 'file'
                ? <div style={{height: '26px', width: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><img src={file} alt="file" height={16} draggable="false"/></div>
                : open === 1 
                    ? <img src={arrowDown} alt="arrow-down" height={26} draggable="false"/>
                    : <img src={arrowRight} alt="arrow-right" height={26} draggable="false"/>
            }
            <div className="file-menu-name" style={{width: nameWidth}}>{name}</div>
            <div style={{flexGrow: 1}}></div>
            {showDots
                ? <img className="file-menu-dots" src={dots} alt="" height={16} draggable="false"/>
                : <></>
            }
        </div>
    )
}

export default FileMenuName