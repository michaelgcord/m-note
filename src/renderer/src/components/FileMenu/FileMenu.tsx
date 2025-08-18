import FileMenuTitle from "./FileMenuTitle"
import FileMenuList from "./FileMenuList"
import FileMenuMouse from "./FileMenuMouse"
import FileMenuFooter from "./FileMenuFooter"

const FileMenu = () : JSX.Element => {
    return (
        <div className="file-menu-container">
            <FileMenuTitle />
            <FileMenuList />
            <FileMenuFooter />
            <FileMenuMouse />
        </div>
    )
}

export default FileMenu