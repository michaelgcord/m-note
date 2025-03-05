import FileMenuTitle from "./FileMenuTitle"
import LineDivider from "../Helper/LineDivider"
import FileMenuList from "./FileMenuList"
import FileMenuMouse from "./FileMenuMouse"

const FileMenu = () : JSX.Element => {
    return (
        <div className="file-menu-container">
            <FileMenuTitle />
            <LineDivider />
            <FileMenuList />
            <FileMenuMouse />
        </div>
    )
}

export default FileMenu