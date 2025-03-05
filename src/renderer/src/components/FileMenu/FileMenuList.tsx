import { useEffect, useState } from "react"
import FileMenuItem from "./FileMenuItem"
import FileMenuInput from "./FileMenuInput"

interface Folder {
    id: number
    parent_id: number | null
    name: string
    type: string
    open: number
}

const FileMenuList = (): JSX.Element => {
    const [data, setData] = useState<Array<Folder>>([])

    // Fetch folder data on first render
    useEffect(() => {
        const result = window.api.getFolders(null)
        setData(result)
    }, [])

    return (
        <div className="file-menu-list">
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