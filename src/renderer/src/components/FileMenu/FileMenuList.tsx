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
    const mouseObj = useFileMenuStore((state:any) => state.mouseObj)

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

    return (
        <div className="file-menu-list" onMouseUp={handleMouseUp}>
            <FileMenuInput id={null} padding="0px" setData={setData}/>
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