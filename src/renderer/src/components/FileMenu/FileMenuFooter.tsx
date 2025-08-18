import addbutton from "../../assets/icons/add-circle-line.svg"
import { useFileMenuStore } from "@renderer/stores/useFileMenuStore"
import { useRef, useEffect } from "react"

const FileMenuFooter = () : JSX.Element => {
    const setInputObj = useFileMenuStore((state:any) => state.setInputObj)
    const inputObj = useFileMenuStore((state:any) => state.inputObj)
    const addFileRef = useRef<any>(null)
    const addFolderRef = useRef<any>(null)

    const setInputType = (type: string) => {
        setInputObj({...inputObj, show: true, type: type})
    }

    useEffect(() => {
        setInputObj({...inputObj, addFileRef: addFileRef, addFolderRef: addFolderRef})
    }, [])

    return (
        <div className="file-menu-footer-container unselectable">
            <div ref={addFileRef} className="file-menu-footer-item" onClick={() => setInputType('file')}>
                <img src={addbutton} alt="" height={20} draggable="false"/>
                <div>Add File</div>
            </div>
            <div ref={addFolderRef} className="file-menu-footer-item" onClick={() => setInputType('folder')}>
                <img src={addbutton} alt="" height={20} draggable="false"/>
                <div>Add Folder</div>
            </div>            
        </div>
    )
}

export default FileMenuFooter