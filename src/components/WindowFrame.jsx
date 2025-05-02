import React, { useContext, useRef } from 'react'
import Draggable from 'react-draggable'
import { MenuContext } from '../utils/MenuContext'

const WindowFrame = () => {
    const { openWindows, closeWindow } = useContext(MenuContext)
    const refs = useRef({}) // Store refs for each menuName

    const handleClose = (menuName) => {
        closeWindow(menuName) // Close the window for the given menu
    }

    return (
        <div className="draggable-container z-10" style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            {openWindows.map((menuName) => {
                // Create a ref for the current menuName if it doesn't exist
                if (!refs.current[menuName]) {
                    refs.current[menuName] = React.createRef()
                }

                return (
                    <Draggable
                        key={menuName}
                        handle=".windowHeader"
                        bounds="parent"
                        nodeRef={refs.current[menuName]}
                    >
                        <div className="windowFrame resizable" ref={refs.current[menuName]}>
                            <div className="windowHeader">
                                <div className="windowTitle">Selected Menu: {menuName}</div>
                                <div className="windowControls">
                                    <button
                                        className="closeBtn"
                                        onClick={() => handleClose(menuName)}
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                            <div className="windowContent">
                                <p className="text-white">Content for {menuName} goes here...</p>
                            </div>
                        </div>
                    </Draggable>
                )
            })}
        </div>
    )
}

export default WindowFrame