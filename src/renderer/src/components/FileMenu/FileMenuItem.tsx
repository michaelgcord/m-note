import { useEffect, useState } from "react"
import FileMenuName from "./FileMenuName"
import FileMenuRename from "./FileMenuRename"
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
    const highlightObj = useFileMenuStore((state:any) => state.highlightObj)
    const [data, setData] = useState<Array<Folder>>([])
    const [showFolder, setShowFolder] = useState<number>(open)
    const [showRename, setShowRename] = useState<boolean>(false)
    const padding = (depth * 20)
    const inputPadding = (depth * 20) + 20 + 'px'

    // Fetch folders whose parent_id matches this folder's id
    useEffect(() => {
        if (type === 'file') return // files don't need to fetch
        const result = window.api.getFolders(id)
        setData(result)
    }, [])

    const updateFolders = () => {
        // Get folder data of drag element
        const result = window.api.getSingleFolder(mouseObj.folder.id)

        if (type === 'file') { // If mouseUp on a file, we add drag element to its parent folder and update
            window.api.editFolder(parent_id, result.name, result.open, result.id)
            setParentData(window.api.getFolders(parent_id))
        }
        if (type === 'folder') { // If mouseUp on a folder, we add drag element to current folder
            window.api.editFolder(id, result.name, result.open, result.id)
            setData(window.api.getFolders(id))
        }

        // Update drag element's prev parent folder to tell frontend its no longer there
        mouseObj.folder.setParentData(window.api.getFolders(mouseObj.folder.parent_id))
    }

    const checkConstraints = () => {
        console.log('Checking constraints...')
        // if (type != 'folder') {
        //     console.error("ERROR: Files cannot contain folders.")
        //     return false
        // }
        if (id === mouseObj.folder.id) {
            console.error("ERROR: Folders can't be nested into themselves.")
            return false
        }
        if (id === mouseObj.folder.parent_id) {
            console.error("ERROR: Folder already exists inside this folder.")
            return false
        }
        if (window.api.checkSubFolders(mouseObj.folder.id, id)) {
            console.error("ERROR: Folder cannot be nested into its subfolders")
            return false
        }
        const maxDepth = 4
        if (depth + window.api.checkFolderDepth(mouseObj.folder.id) >= maxDepth) {
            console.error("ERROR: Folder cannot go past a depth of 4")
            return false
        }
        return true
    }

    const handleMouseUp = () => {
        if (mouseObj.isDragging === false) return
        if (!checkConstraints()) return

        updateFolders()
    }

    // need to also get list of child ids
    return (
        <div className="file-menu-item" style={{backgroundColor: (highlightObj.hoverID === id && mouseObj.isDragging && highlightObj.show && mouseObj.folder.parent_id != id && mouseObj.folder.id != id) ? "#585858" : "transparent"}}>
            {showRename
                ? <FileMenuRename id={id} name={name} type={type} parent_id={parent_id} setParentData={setParentData} setShowRename={setShowRename} padding={padding}/>      
                : <div onMouseUp={handleMouseUp}>
                    <FileMenuName 
                        id={id} 
                        parent_id={parent_id} 
                        setParentData={setParentData} 
                        type={type} 
                        name={name} 
                        open={showFolder} 
                        setOpen={setShowFolder} 
                        padding={padding}
                        setShowRename={setShowRename}
                    />
                </div>
            }
            <div className="file-menu-folder">
                <FileMenuInput id={id} padding={inputPadding} setData={setData} depth={depth}/>
                <div className="file-menu-vertical-line" style={{marginLeft: padding + 'px'}}/>
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