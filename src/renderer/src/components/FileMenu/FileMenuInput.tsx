import { useRef, useEffect, useState } from "react"
import arrowRight from "../../assets/icons/arrow-right.svg"
import file from "../../assets/icons/file.svg"
import { useFileMenuStore } from "@renderer/stores/useFileMenuStore"

interface Folder {
    id: number
    parent_id: number | null
    name: string
    type: string
    open: number
}

interface FileMenuInputProps {
    id: number | null
    padding: string,
    setData: React.Dispatch<React.SetStateAction<Folder[]>>
    depth: number
}

const FileMenuInput = ({id, padding, setData, depth} : FileMenuInputProps) : JSX.Element => {
    const inputRef = useRef<any>(null)
    const [input, setInput] = useState<string>("")
    const [showError, setShowError] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>("")
    const inputObj = useFileMenuStore((state:any) => state.inputObj)
    const setInputObj = useFileMenuStore((state:any) => state.setInputObj)
    const maxDepth = 2

    // Focus into input only after the input-field is inserted into the DOM
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [inputRef.current])

    // Reset input when component disappears and focus when component reappears
    useEffect(() => {
        if (inputObj.show === false) {
            setInput("")
            setShowError(false)
        } else {
            if (inputRef.current) {
                inputRef.current.focus()
            }
        }
    }, [inputObj])

    const removeInput = () => {
        setInputObj({...inputObj, show: false})
    }

    const handleChange = (e:any) => {
        setInput(e.target.value)
        if (e.target.value == false) {
            setErrorMessage("A file or folder name must be provided.")
            setShowError(true)
        } else {
            setShowError(false)
        }
    }

    const addFolder = () => {
        let inputTrimmed = input.trim()
        
        // if input is empty, unmount input
        if (inputTrimmed == '') {
            removeInput()
            return
        }

        // if name already exists, show error
        if (window.api.checkNameExists(inputTrimmed, inputObj.type)) {
            setShowError(true)
            setErrorMessage("A file or folder with this name already exists.")
            return
        }

        //add new folder/file into database
        window.api.addFolder(inputTrimmed, id, inputObj.type)

        // refetch data with new folder and update state in FileMenuItem
        const data = window.api.getFolders(id)
        setData(data)

        removeInput()
    }

    // remove input when user clicks outside of input and add file / add folder buttons
    useEffect(() => {
        const handleClickOutside = (event:any) => {
        if (inputRef.current 
            && !inputRef.current.contains(event.target) 
            && !inputObj.addFileRef.current.contains(event.target) 
            && !inputObj.addFolderRef.current.contains(event.target)) 
            {
                addFolder()
                console.log(inputObj)
            }
        }
        document.addEventListener("click", handleClickOutside);
        return () => {
        document.removeEventListener("click", handleClickOutside);
        };
    }, [inputRef, inputObj]);

    const handleEnter = (e:any) => {
        if (e.key === 'Enter') {
            addFolder()
        }
        if (e.key === 'Escape') {
            removeInput()
        }
    }

    return (
        <>
        {(inputObj.id === id && inputObj.show && !(inputObj.type === 'folder' && depth >= maxDepth)) ?
            <div className="file-menu-input-container" style={{paddingLeft: padding}}>
                {inputObj.type === 'folder'
                    ? <img src={arrowRight} alt="right-arrow" height={26} width={30}/>
                    : <div style={{height: '26px', width: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><img src={file} alt="file" height={16}/></div>
                }
                <div className="file-menu-error-container">
                    <input
                    className="file-menu-input"
                    ref={inputRef} 
                    onChange={handleChange} 
                    onKeyDown={handleEnter} 
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
        : <></>}
        </>
    )
}

export default FileMenuInput