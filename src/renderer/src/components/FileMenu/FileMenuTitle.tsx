import fileAdd from "../../assets/icons/file-add.svg"
import folderAdd from "../../assets/icons/folder-add.svg"

const FileMenuTitle = (): JSX.Element => {
    return (
        <div className="file-menu-title">
            <div>M Note</div>
            <div style={{flexGrow: 1}}></div>
            <img src={folderAdd} alt="fileAdd" style={{marginTop: '1px'}} className="file-menu-item-title"/>
            <img src={fileAdd} alt="fileAdd" className="file-menu-item-title"/>
        </div>
    )
}

export default FileMenuTitle