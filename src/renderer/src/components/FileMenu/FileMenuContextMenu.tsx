import { useRef, useEffect, useState } from "react"
import { useFileMenuStore } from "@renderer/stores/useFileMenuStore"

interface Position {
    x: 0
    y: 0
}

const FileMenuContextMenu = () => {
    const contextMenuRef = useRef<any>(null)
    const contextMenuObj = useFileMenuStore((state:any) => state.contextMenuObj)
    const setContextMenuObj = useFileMenuStore((state:any) => state.setContextMenuObj)
    const mouseObj = useFileMenuStore((state:any) => state.mouseObj)
    const [position, setPosition] = useState<Position>({x: 0, y: 0})
    const [isReady, setIsReady] = useState<boolean>(false)

    useEffect(() => {
        if (contextMenuRef.current) {
            contextMenuRef.current.focus()
        }
    }, [contextMenuRef.current])

    useEffect(() => {
        if (!contextMenuObj.showContext) return
        setPosition({x: mouseObj.x, y: mouseObj.y})
        setIsReady(true)
    }, [contextMenuObj.showContext])

    const handleBlur = () => {
        setContextMenuObj({...contextMenuObj, showContext: false})
        setIsReady(false)
    }

    const handleDelete = () => {
        window.api.deleteNotes(contextMenuObj.id)
        window.api.deleteFolder(contextMenuObj.id)
        contextMenuObj.setParentData(window.api.getFolders(contextMenuObj.parent_id))
        setContextMenuObj({...contextMenuObj, showContext: false})
    }

    const handleRename = () => {
        contextMenuObj.setShowRename(true)
        setContextMenuObj({...contextMenuObj, showContext: false})
    }

    return (
        <>
        {contextMenuObj.showContext && isReady ? 
            <div 
                className="file-menu-context-menu" 
                ref={contextMenuRef} 
                tabIndex={0} 
                onBlur={handleBlur}
                style={{top: position.y, left: position.x}}
            >
                <div style={{display: 'flex'}}>
                    <div onClick={handleRename}>Rename...</div>
                    <div style={{flexGrow: 1}}></div>
                    <div>F2</div>
                </div>
              <div style={{display: 'flex'}}>
                    <div onClick={handleDelete}>Delete</div>
                    <div style={{flexGrow: 1}}></div>
                    <div>Delete</div>
                </div>                
            </div>
        : <></>}
        </>
    )
}

export default FileMenuContextMenu