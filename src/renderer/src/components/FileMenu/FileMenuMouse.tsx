import { useFileMenuStore } from "@renderer/stores/useFileMenuStore"
import { useEffect } from "react"

const FileMenuMouse = () : JSX.Element => {
    const mouseObj = useFileMenuStore((state:any) => state.mouseObj)
    const setMouseObj = useFileMenuStore((state:any) => state.setMouseObj)

    useEffect(() => {
        // tracks mouse position inside window and sets it to mouse object
        const trackMouse = (e:any) => {
            e.preventDefault()
            setMouseObj({...mouseObj, x: e.clientX, y: e.clientY})
        }
        
        // remove mouse when left click is released
        const reset = () => {
            setMouseObj({...mouseObj, isDragging: false})
        }

        // add event listeners
        window.addEventListener('mousemove', trackMouse)
        window.addEventListener('mouseup', reset)

        return () => {
            window.removeEventListener('mousemove', trackMouse)
            window.removeEventListener('mouseup', reset)
        }
    }, [mouseObj])

    return (
        <>
        {mouseObj.isDragging
            ? <div className="file-menu-mouse" style={{left: mouseObj.x + 15, top: mouseObj.y + 15}}>
                {mouseObj.folder.name}
            </div>
            : <></>
        }
        </>
    )
}

export default FileMenuMouse