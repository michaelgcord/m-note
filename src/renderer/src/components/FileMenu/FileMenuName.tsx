import arrowDown from "../../assets/icons/arrow-down.svg"
import arrowRight from "../../assets/icons/arrow-right.svg"
import file from "../../assets/icons/file.svg"
import { useFileMenuStore } from "@renderer/stores/useFileMenuStore"
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
    padding: string
}

interface Move {
    x: number
    y: number
    isMouseDown: boolean
}

const FileMenuName = ({id, parent_id, setParentData, type, name, open, setOpen, padding} : FileMenuNameProps) : JSX.Element => {
    const inputObj = useFileMenuStore((state:any) => state.inputObj)
    const setInputObj = useFileMenuStore((state:any) => state.setInputObj)
    const highlightObj = useFileMenuStore((state:any) => state.highlightObj)
    const setHighlightObj = useFileMenuStore((state:any) => state.setHighlightObj)
    const mouseObj = useFileMenuStore((state:any) => state.mouseObj)
    const setMouseObj = useFileMenuStore((state:any) => state.setMouseObj)
    const [checkMove, setCheckMove] = useState<Move>({x: 0, y: 0, isMouseDown: false})

    // reset check move on mouse up
    useEffect(() => {
        const reset = () => {
            setCheckMove({...checkMove, isMouseDown: false})
        }
        window.addEventListener('mouseup', reset)
        return () => {
            removeEventListener('mouseup', reset)
        }
    }, [])

    // toggle folders to open and close
    const toggleOpen = () => {
        if (type === 'file') return // no need to toggle for files
        if (open === 1) {
            setOpen(0)
        } else {
            setOpen(1)
        }
    }

    // mount input to appropriate folder and highlight folder when clicked
    const selectFolder = () => {
        if (type === 'folder') {
            setInputObj({...inputObj, id: id})
        } else { // if file is selected, mount input to its parent folder
            setInputObj({...inputObj, id: parent_id})
        }
        setHighlightObj({...highlightObj, leftClickID: id})
    }

    const handleClick = () => {
        toggleOpen()
        selectFolder()
    }

    const setMouse = () => {
        setMouseObj({...mouseObj, isDragging: true, id: id, parent_id: parent_id, setParentData: setParentData, name: name})
    }

    const handleMouseDown = () => {
        setCheckMove({...checkMove, isMouseDown: true, x: mouseObj.x, y: mouseObj.y})
    }

    const handleMouseMove = () => {
        if (checkMove.isMouseDown) {
            const range = 3
            if (
                (mouseObj.x > checkMove.x + range) ||
                (mouseObj.x < checkMove.x - range) ||
                (mouseObj.y > checkMove.y + range) ||
                (mouseObj.y < checkMove.y - range)
            ) {
                setMouse()
            }
        }
    }

    return (
        <div onClick={handleClick} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} className="file-menu-name unselectable" style={{paddingLeft: padding, backgroundColor: highlightObj.leftClickID === id ? "gray" : ""}}>
            {type === 'file'
                ? <div style={{height: '26px', width: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><img src={file} alt="file" height={16}/></div>
                : open === 1 
                    ? <img src={arrowDown} alt="arrow-down" height={26}/>
                    : <img src={arrowRight} alt="arrow-right" height={26}/>
            }
            <div>{name}</div>
        </div>
    )
}

export default FileMenuName