import minimize from "../../assets/icons/subtract-line.svg"
import close from "../../assets/icons/close-line.svg"
import { useState } from "react"

const SystemController = () : JSX.Element => {
    const [isHoverMin, setIsHoverMin] = useState<boolean>(false)
    const [isHoverClose, setIsHoverClose] = useState<boolean>(false)

    const handleMinimize = () => {
        window.electron.ipcRenderer.send('minimize')
    }

    const handleClose = () => {
        window.electron.ipcRenderer.send('close')
    }

    const setMinimize = (value:boolean) => {
        // if (value) {
        //     console.log('true')
        // } else {
        //     console.log('false')
        // }
        setIsHoverMin(value)
    }

    const setClose = (value:boolean) => {
        setIsHoverClose(value)
    }

    return (
        <>
        <div className="notes-bar-icon-animation" onMouseOver={() => setMinimize(true)} onMouseLeave={() => setMinimize(false)} style={{backgroundColor: isHoverMin ? 'grey' : "", height: '100%', display: 'flex', alignItems: 'center', flexGrow: '1'}}>
            <img className="no-drag" style={{flexGrow: 1}} onClick={handleMinimize} src={minimize} alt="" height={24}/>
        </div>
        <div className="notes-bar-icon-animation" onMouseOver={() => setClose(true)} onMouseLeave={() => setClose(false)} style={{backgroundColor: isHoverClose ? 'grey' : "", height: '100%', display: 'flex', alignItems: 'center', flexGrow: '1'}}>
            <img className="no-drag" style={{flexGrow: 1}} onClick={handleClose} src={close} alt="" height={24}/>
        </div>
        </>
    )
}

export default SystemController