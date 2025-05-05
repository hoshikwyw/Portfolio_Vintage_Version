import React, { useContext, useRef, useState, useEffect } from 'react'
import Draggable from 'react-draggable'
import { MenuContext } from '../utils/MenuContext'
import Home from './Home'
import Settings from './Settings'
import Projects from './Projects'
import Chat from './Chat'

const WindowFrame = ({ focusedWindow, onFocus }) => {
    const { openWindows, closeWindow } = useContext(MenuContext)
    const refs = useRef({})
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight - 60,
    })

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight - 60,
            })
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const handleClose = (menuName) => {
        closeWindow(menuName)
    }

    return (
        <div className="draggable-container z-10" style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            {openWindows.map((menuName, index) => {
                if (!refs.current[menuName]) {
                    refs.current[menuName] = React.createRef()
                }
                const offset = index * 30

                return (
                    <Draggable
                        key={menuName}
                        handle=".windowHeader"
                        bounds="parent"
                        nodeRef={refs.current[menuName]}
                        onStart={() => onFocus(menuName)}
                    >
                        <div
                            className="windowFrame resizable"
                            ref={refs.current[menuName]}
                            onClick={() => onFocus(menuName)}
                            style={{
                                width: '70vw',
                                height: '85vh',
                                maxWidth: `${windowSize.width}px`,
                                maxHeight: `${windowSize.height}px`,
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'absolute',
                                top: `calc(5% + ${offset}px)`,
                                left: `calc(5% + ${offset}px)`,
                                transform: 'translate(-50%, -50%)',
                                zIndex: focusedWindow === menuName ? 1000 : index,
                            }}
                        >
                            <div className="windowHeader">
                                <div className="windowTitle">vintage Oro / {menuName}</div>
                                <div className="windowControls">
                                    <button
                                        className="closeBtn"
                                        onClick={() => handleClose(menuName)}
                                    >
                                        <img src="icons/delete.png" alt="delete" />
                                    </button>
                                </div>
                            </div>
                            <div className="windowContent" style={{ flex: 1, overflow: 'auto' }}>
                                {menuName === 'Home' && <Home />}
                                {menuName === 'Settings' && <Settings />}
                                {menuName === 'Projects' && <Projects />}
                                {menuName === 'Send-Message' && <Chat />}
                            </div>
                        </div>
                    </Draggable>
                )
            })}
        </div>
    )
}

export default WindowFrame