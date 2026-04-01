import React, { useContext, useRef, useState, useEffect } from 'react'
import Draggable from 'react-draggable'
import { MenuContext } from '../../context/MenuContext'
import Home from '../windows/Home'
import Settings from '../windows/Settings'
import Projects from '../windows/Projects'
import Chat from '../windows/Chat'
import ProjectImages from '../windows/ProjectImages'

const WindowFrame = ({ focusedWindow, onFocus }) => {
    const { openWindows, closeWindow } = useContext(MenuContext)
    const refs = useRef({})
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight - 60,
    })
    const [windowStates, setWindowStates] = useState({})
    const [resizing, setResizing] = useState(null)
    const [fullscreenWindows, setFullscreenWindows] = useState({})

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

    // Initialize window states
    useEffect(() => {
        const newStates = {}
        openWindows.forEach((menuName, index) => {
            if (!windowStates[menuName] && !fullscreenWindows[menuName]) {
                const offset = index * 30
                const initialX = window.innerWidth * 0.05 + offset
                const initialY = (window.innerHeight - 60) * 0.05 + offset
                newStates[menuName] = {
                    width: window.innerWidth * 0.7,
                    height: (window.innerHeight - 60) * 0.85,
                    x: initialX,
                    y: initialY,
                }
            }
        })
        if (Object.keys(newStates).length > 0) {
            setWindowStates((prev) => ({ ...prev, ...newStates }))
        }
    }, [openWindows])

    const handleClose = (menuName) => {
        closeWindow(menuName)
        setFullscreenWindows((prev) => {
            const newState = { ...prev }
            delete newState[menuName]
            return newState
        })
    }

    const handleFullscreen = (menuName) => {
        setFullscreenWindows((prev) => {
            const newState = { ...prev }
            if (newState[menuName]) {
                delete newState[menuName]
            } else {
                newState[menuName] = true
            }
            return newState
        })
    }

    const startResize = (menuName, direction, e) => {
        e.preventDefault()
        e.stopPropagation()
        onFocus(menuName)
        const currentState = windowStates[menuName] || {
            width: window.innerWidth * 0.7,
            height: (window.innerHeight - 60) * 0.85,
            x: 0,
            y: 0,
        }
        const rect = refs.current[menuName]?.current?.getBoundingClientRect()
        const initialX = rect ? rect.left : 0
        const initialY = rect ? rect.top : 0

        setResizing({
            menuName,
            direction,
            startX: e.clientX,
            startY: e.clientY,
            initialWidth: currentState.width,
            initialHeight: currentState.height,
            initialX: currentState.x !== undefined ? currentState.x : initialX,
            initialY: currentState.y !== undefined ? currentState.y : initialY,
        })
    }

    useEffect(() => {
        if (!resizing) return

        const handleMouseMove = (e) => {
            const { menuName, direction, startX, startY, initialWidth, initialHeight, initialX, initialY } = resizing

            const deltaX = e.clientX - startX
            const deltaY = e.clientY - startY
            const minWidth = 400
            const minHeight = 300
            const maxWidth = windowSize.width
            const maxHeight = windowSize.height

            let newWidth = initialWidth
            let newHeight = initialHeight
            let newX = initialX
            let newY = initialY

            if (direction.includes('right')) {
                newWidth = Math.min(Math.max(initialWidth + deltaX, minWidth), maxWidth)
            }
            if (direction.includes('left')) {
                newWidth = Math.min(Math.max(initialWidth - deltaX, minWidth), maxWidth)
                newX = initialX + (initialWidth - newWidth)
            }
            if (direction.includes('bottom')) {
                newHeight = Math.min(Math.max(initialHeight + deltaY, minHeight), maxHeight)
            }
            if (direction.includes('top')) {
                newHeight = Math.min(Math.max(initialHeight - deltaY, minHeight), maxHeight)
                newY = initialY + (initialHeight - newHeight)
            }

            setWindowStates((prev) => ({
                ...prev,
                [menuName]: {
                    width: newWidth,
                    height: newHeight,
                    x: newX,
                    y: newY,
                },
            }))
        }

        const handleMouseUp = () => {
            setResizing(null)
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [resizing, windowSize])

    const getWindowStyle = (menuName, index) => {
        const isFullscreen = fullscreenWindows[menuName]
        const state = windowStates[menuName]
        const defaultWidth = window.innerWidth * 0.7
        const defaultHeight = (window.innerHeight - 60) * 0.85

        if (isFullscreen) {
            return {
                width: '100vw',
                height: '100vh',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                transform: 'none',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                zIndex: 9999,
                margin: 0,
                padding: 0,
            }
        }

        return {
            width: `${state?.width || defaultWidth}px`,
            height: `${state?.height || defaultHeight}px`,
            maxWidth: `${windowSize.width}px`,
            maxHeight: `${windowSize.height}px`,
            display: 'flex',
            flexDirection: 'column',
            position: 'absolute',
            zIndex: focusedWindow === menuName ? 1000 : index,
        }
    }

    const fullscreenWindowsList = openWindows.filter(menuName => fullscreenWindows[menuName])
    const normalWindowsList = openWindows.filter(menuName => !fullscreenWindows[menuName])

    return (
        <>
            {/* Render fullscreen windows outside container with fixed positioning */}
            {fullscreenWindowsList.map((menuName, index) => {
                if (!refs.current[menuName]) {
                    refs.current[menuName] = React.createRef()
                }

                const windowContent = (
                    <div
                        className="windowFrame resizable"
                        ref={refs.current[menuName]}
                        onClick={() => onFocus(menuName)}
                        style={getWindowStyle(menuName, index)}
                    >
                        <div className="windowHeader">
                            <div className="windowTitle">vintage Oro / {menuName}</div>
                            <div className="windowControls">
                                <button
                                    className="fullscreenBtn"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleFullscreen(menuName)
                                    }}
                                    title="Exit Fullscreen"
                                >
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M5.5 2.5h-3A1 1 0 0 0 1.5 3.5v3M10.5 2.5h3A1 1 0 0 1 14.5 3.5v3M5.5 13.5h-3A1 1 0 0 1 1.5 12.5v-3M10.5 13.5h3a1 1 0 0 0 1-1v-3" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                    </svg>
                                </button>
                                <button
                                    className="closeBtn"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleClose(menuName)
                                    }}
                                >
                                    <img src="icons/delete.png" alt="delete" />
                                </button>
                            </div>
                        </div>
                        <div className="windowContent project-container" style={{ flex: 1, overflow: 'auto' }}>
                            {menuName === 'Home' && <Home />}
                            {menuName === 'Settings' && <Settings />}
                            {menuName === 'Gallery' && <ProjectImages />}
                            {menuName === 'Projects' && <Projects windowSize={{ width: window.innerWidth, height: window.innerHeight }} />}
                            {menuName === 'Send-Message' && <Chat />}
                        </div>
                    </div>
                )

                return (
                    <React.Fragment key={menuName}>
                        {windowContent}
                    </React.Fragment>
                )
            })}

            {/* Render normal windows inside container */}
            <div className="draggable-container z-10" style={{ width: '100vw', height: '100vh', position: 'relative' }}>
                {normalWindowsList.map((menuName, index) => {
                    if (!refs.current[menuName]) {
                        refs.current[menuName] = React.createRef()
                    }

                    const state = windowStates[menuName]
                    const defaultOffset = index * 30
                    const defaultX = window.innerWidth * 0.05 + defaultOffset
                    const defaultY = (window.innerHeight - 60) * 0.05 + defaultOffset

                    const currentState = state || {
                        width: window.innerWidth * 0.7,
                        height: (window.innerHeight - 60) * 0.85,
                        x: defaultX,
                        y: defaultY,
                    }

                    return (
                        <Draggable
                            key={menuName}
                            handle=".windowHeader"
                            bounds="parent"
                            nodeRef={refs.current[menuName]}
                            onStart={() => onFocus(menuName)}
                            onStop={(e, data) => {
                                setWindowStates((prev) => ({
                                    ...prev,
                                    [menuName]: {
                                        ...(prev[menuName] || currentState),
                                        x: data.x,
                                        y: data.y,
                                    },
                                }))
                            }}
                            position={{ x: currentState.x, y: currentState.y }}
                        >
                            <div
                                className="windowFrame resizable"
                                ref={refs.current[menuName]}
                                onClick={() => onFocus(menuName)}
                                style={getWindowStyle(menuName, index)}
                            >
                                <div
                                    className="resize-handle resize-top"
                                    onMouseDown={(e) => startResize(menuName, 'top', e)}
                                />
                                <div
                                    className="resize-handle resize-right"
                                    onMouseDown={(e) => startResize(menuName, 'right', e)}
                                />
                                <div
                                    className="resize-handle resize-bottom"
                                    onMouseDown={(e) => startResize(menuName, 'bottom', e)}
                                />
                                <div
                                    className="resize-handle resize-left"
                                    onMouseDown={(e) => startResize(menuName, 'left', e)}
                                />
                                <div
                                    className="resize-handle resize-top-left"
                                    onMouseDown={(e) => startResize(menuName, 'top-left', e)}
                                />
                                <div
                                    className="resize-handle resize-top-right"
                                    onMouseDown={(e) => startResize(menuName, 'top-right', e)}
                                />
                                <div
                                    className="resize-handle resize-bottom-left"
                                    onMouseDown={(e) => startResize(menuName, 'bottom-left', e)}
                                />
                                <div
                                    className="resize-handle resize-bottom-right"
                                    onMouseDown={(e) => startResize(menuName, 'bottom-right', e)}
                                />
                                <div className="windowHeader">
                                    <div className="windowTitle">vintage Oro / {menuName}</div>
                                    <div className="windowControls">
                                        <button
                                            className="fullscreenBtn"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleFullscreen(menuName)
                                            }}
                                            title="Fullscreen"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                                <path d="M2.5 2.5h3M2.5 2.5v3M13.5 2.5h-3M13.5 2.5v3M2.5 13.5h3M2.5 13.5v-3M13.5 13.5h-3M13.5 13.5v-3" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                            </svg>
                                        </button>
                                        <button
                                            className="closeBtn"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleClose(menuName)
                                            }}
                                        >
                                            <img src="icons/delete.png" alt="delete" />
                                        </button>
                                    </div>
                                </div>
                                <div className="windowContent project-container" style={{ flex: 1, overflow: 'auto' }}>
                                    {menuName === 'Home' && <Home />}
                                    {menuName === 'Settings' && <Settings />}
                                    {menuName === 'Gallery' && <ProjectImages />}
                                    {menuName === 'Projects' && <Projects windowSize={windowSize} />}
                                    {menuName === 'Send-Message' && <Chat />}
                                </div>
                            </div>
                        </Draggable>
                    )
                })}
            </div>
        </>
    )
}

export default WindowFrame
