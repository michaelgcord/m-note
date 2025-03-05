import { useEffect, useState } from "react"
import FileMenuName from "./FileMenuName"
import FileMenuInput from "./FileMenuInput"
import { useFileMenuStore } from "@renderer/stores/useFileMenuStore"

interface Folder {
    id: number
    parent_id: number | null
    name: string
    type: string
    open: number
}

interface FileMenuItemProps {
    id: number
    parent_id: number | null
    setParentData: React.Dispatch<React.SetStateAction<Folder[]>>
    name: string
    type: string
    open: number
    depth: number
}

const FileMenuItem = ({id, parent_id, setParentData, name, type, open, depth} : FileMenuItemProps) : JSX.Element => {
    const mouseObj = useFileMenuStore((state:any) => state.mouseObj)
    const [data, setData] = useState<Array<Folder>>([])
    const [showFolder, setShowFolder] = useState<number>(open)
    const padding = (depth * 20) + 'px'
    const inputPadding = (depth * 20) + 20 + 'px'

    // Fetch folders whose parent_id matches this folder's id
    useEffect(() => {
        if (type === 'file') return // files don't need to fetch
        const result = window.api.getFolders(id)
        setData(result)
    }, [])

    const updateFolders = () => {
        const result = window.api.getSingleFolder(mouseObj.id)
        window.api.editFolder(id, result.name, result.open, result.id)

        mouseObj.setParentData(window.api.getFolders(mouseObj.parent_id))
        setData(window.api.getFolders(id))
    }

    const handleMouseUp = () => {
        if (mouseObj.isDragging === false) return

        updateFolders()
    }

    return (
        <div>
            <div onMouseUp={handleMouseUp}>
                <FileMenuName 
                    id={id} 
                    parent_id={parent_id} 
                    setParentData={setParentData} 
                    type={type} 
                    name={name} 
                    open={showFolder} 
                    setOpen={setShowFolder} 
                    padding={padding}
                />
            </div>
            <div className="file-menu-folder">
                <FileMenuInput id={id} padding={inputPadding} setData={setData}/>
                <div className="file-menu-vertical-line" style={{marginLeft: padding}}/>
                {(showFolder && type === 'folder') ? data.map((item) => {
                    return (
                        <div key={item.id}>
                        <FileMenuItem
                            id={item.id}
                            parent_id={item.parent_id}
                            setParentData={setData}
                            name={item.name}
                            type={item.type}
                            open={item.open}
                            depth={depth+1}
                        />
                        </div>
                    )
                }) : <></>}
            </div>
        </div>
    )
}

export default FileMenuItem