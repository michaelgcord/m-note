import arrowRight from "../../assets/icons/arrow-right.svg"
import file from "../../assets/icons/file.svg"
import { useRef, useEffect, useState } from "react"

interface Folder {
    id: number
    parent_id: number | null
    name: string
    type: string
    open: number
}

interface FileMenuRenameProps {
    id: number
    parent_id: number | null
    name: string
    type: string
    setParentData: React.Dispatch<React.SetStateAction<Folder[]>>
    setShowRename: React.Dispatch<React.SetStateAction<boolean>>
    padding: string
}

const FileMenuRename = ({id, parent_id, name, type, setParentData, setShowRename, padding} : FileMenuRenameProps) => {
    const renameRef = useRef<any>(null)
    const [input, setInput] = useState<string>(name)
    const [showError, setShowError] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>("")
    const nameStart = name

    useEffect(() => {
        if (renameRef.current) {
            renameRef.current.focus()
            renameRef.current.select()
        }
    }, [renameRef.current])

    const handleChange = (e:any) => {
        setInput(e.target.value)
        if (e.target.value == false) {
            setErrorMessage("A file or folder name must be provided.")
            setShowError(true)
        } else {
            setShowError(false)
        }
    }

    const removeInput = () => {
        setShowRename(false)
    }

    const editFolder = () => {
        let inputTrimmed = input.trim()

        // unmount if name stays the same
        if (inputTrimmed == nameStart) {
            setShowRename(false)
            return
        }

        // if input is empty, show error
        if (inputTrimmed == '') {
            setErrorMessage("A file or folder name must be provided.")
            setShowError(true)       
            return
        }

        // if name already exists, show error
        if (window.api.checkNameExists(inputTrimmed, type)) {
            setShowError(true)
            setErrorMessage("A file or folder with this name already exists.")
            return
        }

        //edit folder inside database
        const result = window.api.getSingleFolder(id)
        window.api.editFolder(result.parent_id, inputTrimmed, result.open, id)
        setParentData(window.api.getFolders(parent_id))

        removeInput()
    }

    const handleBlur = () => {
        editFolder()
    }

    const handleEnter = (e:any) => {
        if (e.key === 'Enter') {
            editFolder()
        }
        if (e.key === 'Escape') {
            removeInput()
        }
    }


    return (
        <div className="file-menu-input-container" style={{paddingLeft: padding}}>
            {type === 'folder'
                ? <img src={arrowRight} alt="" height={26}/>
                : <div style={{height: '26px', width: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><img src={file} alt="file" height={16}/></div>
            }
            <div className="file-menu-error-container">
                <input
                className="file-menu-input"
                ref={renameRef} 
                onChange={handleChange} 
                onKeyDown={handleEnter} 
                onBlur={handleBlur} 
                value={input} 
                type="text" 
                spellCheck="false"
                style={{
                    border: showError
                        ? "solid #db1300 1px"
                        : "solid rgba(130, 130, 130, 1) 1px",
                    borderBottom: showError
                        ? "solid rgba(130, 130, 130, 0) 1px"
                        : "solid rgba(130, 130, 130, 1) 1px" 
                }}
                />
                {showError
                    ? <div className="file-menu-error">{errorMessage}</div>
                    : <></>
                }
            </div>
        </div>
    )
}

export default FileMenuRename