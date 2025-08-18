import { useEffect, useState } from "react"
import FileMenuItem from "./FileMenuItem"
import FileMenuInput from "./FileMenuInput"
import { useFileMenuStore } from "@renderer/stores/useFileMenuStore"

interface Folder {
    id: number
    parent_id: number | null
    name: string
    type: string
    open: number
}

const FileMenuList = (): JSX.Element => {
    const [data, setData] = useState<Array<Folder>>([])
    const [isHovering, setIsHovering] = useState(false)
    const mouseObj = useFileMenuStore((state:any) => state.mouseObj)
    const highlightObj = useFileMenuStore((state:any) => state.highlightObj)
    const setHighlightObj = useFileMenuStore((state:any) => state.setHighlightObj)

    // Fetch folder data on first render
    useEffect(() => {
        const result = window.api.getFolders(null)
        setData(result)
    }, [])

    const checkConstraints = () => {
        if (mouseObj.folder.parent_id == null) {
            console.error("ERROR: Folder is already at top level")
            return false
        }
        return true
    }

    const updateFolders = () => {
        const result = window.api.getSingleFolder(mouseObj.folder.id)
        window.api.editFolder(null, result.name, result.open, result.id)

        mouseObj.folder.setParentData(window.api.getFolders(mouseObj.folder.parent_id))
        setData(window.api.getFolders(null))
    }

    const handleMouseUp = () => {
        if (mouseObj.isHoveringFileItem || !mouseObj.isDragging) return
        if (!checkConstraints()) return

        updateFolders()
    }

    const handleMouseOver = () => {
        setIsHovering(true)
        if (highlightObj.hoverID < 0) { // show hover style when user drags mouse back into file menu
            setHighlightObj({...highlightObj, show: true, hoverID: null})
        }
    }

    const handleMouseLeave = () => {
        // when user drags mouse outside of file menu, remove hover style
        setIsHovering(false)
        setHighlightObj({...highlightObj, hoverID: -1})
    }

    return (
        <div className="file-menu-list" onMouseUp={handleMouseUp} onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave} style={{backgroundColor: (highlightObj.hoverID === null && mouseObj.isDragging && highlightObj.show && isHovering && mouseObj.folder.parent_id != null) ? "#585858" : "transparent"}}>
            <FileMenuInput id={null} padding="0px" setData={setData} depth={0}/>
            {data.map((item) => {
                return (
                    <div key={item.id}>
                    <FileMenuItem
                        id={item.id}
                        parent_id={item.parent_id}
                        setParentData={setData}
                        name={item.name}
                        type={item.type}
                        open={item.open}
                        depth={0}
                    />
                    </div>
                )
            })}
        </div>
    )
}

export default FileMenuList