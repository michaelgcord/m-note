import arrowDown from "../../assets/icons/arrow-down.svg"
import arrowRight from "../../assets/icons/arrow-right.svg"
import file from "../../assets/icons/file.svg"

interface FileMenuNameProps {
    type: number,
    name: string,
    open: number,
    setOpen: React.Dispatch<React.SetStateAction<number>>,
    padding: string
}

// Files = 1
// Folders = 0

const FileMenuName = ({type, name, open, setOpen, padding} : FileMenuNameProps) : JSX.Element => {
    const toggleOpen = () => {
        if (open === 1) {
            setOpen(0)
        } else {
            setOpen(1)
        }
    }

    return (
        <div onClick={toggleOpen} className="file-menu-name unselectable" style={{paddingLeft: padding}}>
            {type === 1
                ? <div style={{height: '26px', width: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><img src={file} alt="file" height={16}/></div>
                : open === 1 
                    ? <img src={arrowDown} alt="arrow-down" height={26}/>
                    : <img src={arrowRight} alt="arrow-right" height={26}/>
            }
            <div>{name}</div>
        </div>
    )
}

export default FileMenuName