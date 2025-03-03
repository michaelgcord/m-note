import FileMenuTitle from "./FileMenuTitle"
import LineDivider from "../Helper/LineDivider"
import FileMenuList from "./FileMenuList"

const FileMenu = () : JSX.Element => {
    return (
        <div className="file-menu-container">
            <FileMenuTitle />
            <LineDivider />
            <FileMenuList />
        </div>
    )
}

export default FileMenu