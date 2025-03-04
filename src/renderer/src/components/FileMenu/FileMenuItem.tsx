import { useEffect, useState } from "react"
import FileMenuName from "./FileMenuName"
import FileMenuInput from "./FileMenuInput"

interface Folder {
    id: number
    parent_id: number | null
    name: string
    type: number
    open: number
}

interface FileMenuItemProps {
    id: number
    parent_id: number | null
    name: string
    type: number
    open: number
    depth: number
}

const FileMenuItem = ({id, parent_id, name, type, open, depth} : FileMenuItemProps) : JSX.Element => {
    const [data, setData] = useState<Array<Folder>>([])
    const [showFolder, setShowFolder] = useState<number>(open)
    const padding = (depth * 20) + 'px'
    const inputPadding = (depth * 20) + 20 + 'px'
    const folder = 0
    const file = 1

    // Fetch folders whose parent_id matches this folder's id
    useEffect(() => {
        if (type === file) return // files don't need to fetch
        const result = window.api.getFolders(id)
        setData(result)
    }, [])

    return (
        <div>
            <FileMenuName type={type} name={name} open={showFolder} setOpen={setShowFolder} padding={padding}/>
            <div className="file-menu-folder">
                <FileMenuInput id={id} padding={inputPadding} setData={setData}/>
                <div className="file-menu-vertical-line" style={{marginLeft: padding}}/>
                {(showFolder && type === folder) ? data.map((item) => {
                    return (
                        <div key={item.id}>
                        <FileMenuItem
                            id={item.id}
                            parent_id={item.parent_id}
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