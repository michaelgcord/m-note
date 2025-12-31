import { useRef, useEffect, useState } from "react"
import { useFileMenuStore } from "@renderer/stores/useFileMenuStore"

interface Position {
    x: number
    y: number
}

const FileMenuContextMenu = () => {
    const contextMenuRef = useRef<any>(null)
    const contextMenuObj = useFileMenuStore((state:any) => state.contextMenuObj)
    const setContextMenuObj = useFileMenuStore((state:any) => state.setContextMenuObj)
    const highlightObj = useFileMenuStore((state:any) => state.highlightObj)
    const setHighlightObj = useFileMenuStore((state:any) => state.setHighlightObj)
    const inputObj = useFileMenuStore((state:any) => state.inputObj)
    const setInputObj = useFileMenuStore((state:any) => state.setInputObj)
    const mouseObj = useFileMenuStore((state:any) => state.mouseObj)
    const [position, setPosition] = useState<Position>({x: 0, y: 0})
    const [isReady, setIsReady] = useState<boolean>(false)

    const setContextMenuPosition = () => {
        const height = document.getElementById("file-menu-context-menu")?.clientHeight
        const windowHeight = window.innerHeight
        if (height) { // avoid typescript warning
            if (height + mouseObj.y >= windowHeight) {
                console.log('not enough space')
                setPosition({x: mouseObj.x, y: mouseObj.y - height})
            } else {
                setPosition({x: mouseObj.x, y: mouseObj.y})
            }
        }
    }

    useEffect(() => {
        if (contextMenuRef.current) {
            contextMenuRef.current.focus()
        }
    }, [contextMenuRef.current, isReady])

    useEffect(() => {
        if (!contextMenuObj.showContext) return
        setContextMenuPosition()
        setIsReady(true)
    }, [contextMenuObj.showContext])

    const handleBlur = () => {
        setContextMenuObj({...contextMenuObj, showContext: false})
        setIsReady(false)
        setContextMenuObj({...contextMenuObj, showContext: false, showFileOption: false, showFolderOption: false})
        setHighlightObj({...highlightObj, rightClickID: null})
    }

    const handleDelete = () => {
        setIsReady(false)
        window.api.deleteFolderNotes(contextMenuObj.id)
        window.api.deleteFolder(contextMenuObj.id)
        contextMenuObj.setParentData(window.api.getFolders(contextMenuObj.parent_id))
        setContextMenuObj({...contextMenuObj, showContext: false, showFileOption: false, showFolderOption: false})
        setHighlightObj({...highlightObj, rightClickID: null})
    }

    const handleRename = () => {
        setIsReady(false)
        contextMenuObj.setShowRename(true)
        setContextMenuObj({...contextMenuObj, showContext: false, showFileOption: false, showFolderOption: false})
        setHighlightObj({...highlightObj, rightClickID: null})
    }

    const handleNewFile = () => {
        console.log('new file')
        setIsReady(false)
        setInputObj({...inputObj, id: contextMenuObj.id, show: true, type: 'file'})
    }

    const handleNewFolder = () => {
        setIsReady(false)
        setInputObj({...inputObj, id: contextMenuObj.id, show: true, type: 'folder'})        
    }

    return (
        <>
        {contextMenuObj.showContext && 
            <div
                id="file-menu-context-menu" 
                className="file-menu-context-menu" 
                ref={contextMenuRef} 
                tabIndex={0} 
                onBlur={handleBlur}
                style={{visibility: isReady ? "visible" : "hidden", top: position.y, left: position.x}}
            >
                {contextMenuObj.showFileOption && 
                    <div>
                        <div onClick={handleNewFile}>New File...</div>
                    </div>
                }
                {contextMenuObj.showFolderOption &&
                    <div>
                        <div onClick={handleNewFolder}>New Folder...</div>
                    </div>
                }
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
        }
        </>
    )
}

export default FileMenuContextMenu