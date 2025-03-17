import { useRef, useEffect, useState } from "react"
import { useFileMenuStore } from "@renderer/stores/useFileMenuStore"

interface Position {
    x: 0
    y: 0
}

interface Folder {
    id: number
    parent_id: number | null
    name: string
    type: string
    open: number
}

interface FileMenuContextMenuProps {
    id: number
    parent_id: number | null
    setParentData: React.Dispatch<React.SetStateAction<Folder[]>>
    showContext: boolean
    setShowContext: React.Dispatch<React.SetStateAction<boolean>>
    setShowRename: React.Dispatch<React.SetStateAction<boolean>>
}

const FileMenuContextMenu = ({showContext, setShowContext, id, parent_id, setParentData, setShowRename} : FileMenuContextMenuProps) => {
    const contextMenuRef = useRef<any>(null)
    const mouseObj = useFileMenuStore((state:any) => state.mouseObj)
    const [position, setPosition] = useState<Position>({x: 0, y: 0})
    const [isReady, setIsReady] = useState<boolean>(false)

    useEffect(() => {
        if (contextMenuRef.current) {
            contextMenuRef.current.focus()
        }
    }, [contextMenuRef.current])

    useEffect(() => {
        if (!showContext) return
        setPosition({x: mouseObj.x, y: mouseObj.y})
        setIsReady(true)
    }, [showContext])

    const handleBlur = () => {
        setShowContext(false)
        setIsReady(false)
    }

    const handleDelete = () => {
        window.api.deleteNotes(id)
        window.api.deleteFolder(id)
        setParentData(window.api.getFolders(parent_id))
        setShowContext(false)
    }

    const handleRename = () => {
        setShowRename(true)
        setShowContext(false)
    }

    return (
        <>
        {showContext && isReady ? 
            <div 
                className="file-menu-context-menu" 
                ref={contextMenuRef} 
                tabIndex={0} 
                onBlur={handleBlur}
                style={{top: 0, left: position.x}}
            >
                <div onClick={handleDelete}>Delete</div>
                <div onClick={handleRename}>Rename</div>
            </div>
        : <></>}
        </>
    )
}

export default FileMenuContextMenu