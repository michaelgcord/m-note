import minimize from "../../assets/icons/subtract-line.svg"
import close from "../../assets/icons/close-line.svg"

const SystemController = () : JSX.Element => {
    const handleMinimize = () => {
        window.electron.ipcRenderer.send('minimize')
    }

    const handleClose = () => {
        window.electron.ipcRenderer.send('close')
    }

    return (
        <>
            <img className="no-drag" onClick={handleMinimize} src={minimize} alt="" height={18}/>
            <img className="no-drag" onClick={handleClose} src={close} alt="" height={18}/>
        </>
    )
}

export default SystemController