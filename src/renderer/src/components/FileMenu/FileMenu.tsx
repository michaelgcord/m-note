import FileMenuTitle from "./FileMenuTitle"
import FileMenuList from "./FileMenuList"
import FileMenuFooter from "./FileMenuFooter"
import FileMenuMouse from "./FileMenuMouse"
import FileMenuContextMenu from "./FileMenuContextMenu"

const FileMenu = () : JSX.Element => {
    return (
        <div className="file-menu-container">
            <FileMenuTitle />
            <FileMenuList />
            <FileMenuFooter />
            <FileMenuMouse />
            <FileMenuContextMenu />
        </div>
    )
}

export default FileMenu