import fileAdd from "../../assets/icons/file-add.svg"
import folderAdd from "../../assets/icons/folder-add.svg"
import { useFileMenuStore } from "@renderer/stores/useFileMenuStore"

const FileMenuTitle = (): JSX.Element => {
    const setInputObj = useFileMenuStore((state:any) => state.setInputObj)
    const inputObj = useFileMenuStore((state:any) => state.inputObj)

    const setInputType = (type: number) => {
        console.log(type)
        console.log(inputObj)
        setInputObj({...inputObj, show: true, type: type})
    }

    return (
        <div className="file-menu-title unselectable">
            <div>M Note</div>
            <div style={{flexGrow: 1}}></div>
            <img onClick={() => setInputType(0)} src={folderAdd} alt="fileAdd" style={{marginTop: '1px'}} className="file-menu-item-title"/>
            <img onClick={() => setInputType(1)} src={fileAdd} alt="fileAdd" className="file-menu-item-title"/>
        </div>
    )
}

export default FileMenuTitle