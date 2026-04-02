import React, { useContext, useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useDragControls, useMotionValue } from 'framer-motion'
import { MenuContext } from '../../context/MenuContext'
import Home from '../windows/Home'
import Settings from '../windows/Settings'
import Projects from '../windows/Projects'
import Chat from '../windows/Chat'
import ProjectImages from '../windows/ProjectImages'

const windowSpring = { type: 'spring', stiffness: 300, damping: 28, mass: 0.8 }

const windowIcons = {
    'Home': 'icons/home.svg',
    'Projects': 'icons/openFolder.svg',
    'Gallery': 'icons/gallery.svg',
    'Send-Message': 'icons/terminal.svg',
    'Settings': 'icons/settings.svg',
}

const windowVariants = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: {
        opacity: 1, scale: 1,
        transition: { ...windowSpring, opacity: { duration: 0.25 } },
    },
    exit: {
        opacity: 0, scale: 0.92,
        transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] },
    },
}

const fullscreenVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] } },
    exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } },
}

const WindowContent = React.memo(({ menuName, windowSize }) => {
    switch (menuName) {
        case 'Home': return <Home />
        case 'Settings': return <Settings />
        case 'Gallery': return <ProjectImages />
        case 'Projects': return <Projects windowSize={windowSize} />
        case 'Send-Message': return <Chat />
        default: return null
    }
})

const DraggableWindow = ({
    menuName, index, initialState, windowSize,
    focusedWindow, onFocus, onClose, onFullscreen, onMinimize,
    onStateCommit,
}) => {
    const dragControls = useDragControls()
    const resizeRef = useRef(null)
    const rafRef = useRef(null)

    const mvX = useMotionValue(initialState.x)
    const mvY = useMotionValue(initialState.y)
    const mvW = useMotionValue(initialState.width)
    const mvH = useMotionValue(initialState.height)

    // Sync from parent state
    useEffect(() => {
        mvX.jump(initialState.x)
        mvY.jump(initialState.y)
        mvW.jump(initialState.width)
        mvH.jump(initialState.height)
    }, [initialState.x, initialState.y, initialState.width, initialState.height])

    const startResize = useCallback((direction, e) => {
        e.preventDefault()
        e.stopPropagation()
        onFocus(menuName)

        resizeRef.current = {
            direction,
            startMouseX: e.clientX,
            startMouseY: e.clientY,
            origW: mvW.get(),
            origH: mvH.get(),
            origX: mvX.get(),
            origY: mvY.get(),
        }

        const handleMouseMove = (e) => {
            if (!resizeRef.current) return
            if (rafRef.current) cancelAnimationFrame(rafRef.current)

            rafRef.current = requestAnimationFrame(() => {
                const r = resizeRef.current
                if (!r) return

                const dx = e.clientX - r.startMouseX
                const dy = e.clientY - r.startMouseY
                const minW = 400, minH = 300
                const maxW = windowSize.width, maxH = windowSize.height

                let nw = r.origW, nh = r.origH, nx = r.origX, ny = r.origY

                if (r.direction.includes('right')) nw = Math.min(Math.max(r.origW + dx, minW), maxW)
                if (r.direction.includes('left')) {
                    nw = Math.min(Math.max(r.origW - dx, minW), maxW)
                    nx = r.origX + (r.origW - nw)
                }
                if (r.direction.includes('bottom')) nh = Math.min(Math.max(r.origH + dy, minH), maxH)
                if (r.direction.includes('top')) {
                    nh = Math.min(Math.max(r.origH - dy, minH), maxH)
                    ny = r.origY + (r.origH - nh)
                }

                mvW.set(nw)
                mvH.set(nh)
                mvX.set(nx)
                mvY.set(ny)
            })
        }

        const handleMouseUp = () => {
            onStateCommit(menuName, {
                width: mvW.get(), height: mvH.get(),
                x: mvX.get(), y: mvY.get(),
            })
            resizeRef.current = null
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
            document.body.style.cursor = ''
            document.body.style.userSelect = ''
        }

        document.body.style.userSelect = 'none'
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
    }, [menuName, windowSize, onFocus, onStateCommit, mvX, mvY, mvW, mvH])

    return (
        <motion.div
            className="windowFrame resizable"
            variants={windowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            drag
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{
                left: -mvX.get(),
                top: -mvY.get(),
                right: Math.max(0, windowSize.width - mvW.get() - mvX.get()),
                bottom: Math.max(0, windowSize.height - mvH.get() - mvY.get()),
            }}
            dragElastic={0.04}
            dragMomentum={false}
            dragTransition={{ power: 0, timeConstant: 0 }}
            whileDrag={{
                scale: 1.005,
                boxShadow: '0 30px 90px rgba(0,0,0,0.28), 0 12px 36px rgba(0,0,0,0.18)',
            }}
            onDragStart={() => onFocus(menuName)}
            onDragEnd={(_, info) => {
                // info.point has the final position, but we need to commit
                // the delta to our tracked position
                const finalX = mvX.get() + info.offset.x
                const finalY = mvY.get() + info.offset.y
                // Clamp to bounds
                const clampedX = Math.max(0, Math.min(finalX, windowSize.width - mvW.get()))
                const clampedY = Math.max(0, Math.min(finalY, windowSize.height - mvH.get()))
                onStateCommit(menuName, {
                    width: mvW.get(), height: mvH.get(),
                    x: clampedX, y: clampedY,
                })
            }}
            onClick={() => onFocus(menuName)}
            style={{
                width: mvW,
                height: mvH,
                x: mvX,
                y: mvY,
                maxWidth: windowSize.width,
                maxHeight: windowSize.height,
                position: 'absolute',
                left: 0,
                top: 0,
                zIndex: focusedWindow === menuName ? 1000 : 100 + index,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {['top', 'right', 'bottom', 'left', 'top-left', 'top-right', 'bottom-left', 'bottom-right'].map((dir) => (
                <div
                    key={dir}
                    className={`resize-handle resize-${dir}`}
                    onMouseDown={(e) => startResize(dir, e)}
                />
            ))}

            <div
                className="windowHeader"
                onPointerDown={(e) => {
                    if (e.target.closest('button')) return
                    dragControls.start(e)
                }}
            >
                <div className="windowTitle">
                    {windowIcons[menuName] && (
                        <img src={windowIcons[menuName]} alt="" className="w-4 h-4 inline-block mr-2 filter brightness-0 invert opacity-80" style={{ verticalAlign: 'middle' }} />
                    )}
                    vintage Kayv / {menuName}
                </div>
                <div className="windowControls">
                    <button className="minimizeBtn" onClick={(e) => { e.stopPropagation(); onMinimize(menuName) }} title="Minimize">
                        <svg width="16" height="16" viewBox="0 0 16 16"><path d="M3 8h10" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg>
                    </button>
                    <button className="fullscreenBtn" onClick={(e) => { e.stopPropagation(); onFullscreen(menuName) }} title="Fullscreen">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M2.5 2.5h3M2.5 2.5v3M13.5 2.5h-3M13.5 2.5v3M2.5 13.5h3M2.5 13.5v-3M13.5 13.5h-3M13.5 13.5v-3" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        </svg>
                    </button>
                    <button className="closeBtn" onClick={(e) => { e.stopPropagation(); onClose(menuName) }}>
                        <img src="icons/delete.png" alt="delete" />
                    </button>
                </div>
            </div>

            <div className="windowContent project-container" style={{ flex: 1, overflow: 'auto' }}>
                <WindowContent menuName={menuName} windowSize={windowSize} />
            </div>
        </motion.div>
    )
}

// Counter for cascading new windows
let windowCounter = 0

const WindowFrame = ({ focusedWindow, onFocus }) => {
    const { openWindows, minimizedWindows, closeWindow, minimizeWindow } = useContext(MenuContext)
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight - 48, // taskbar height
    })
    const [windowStates, setWindowStates] = useState({})
    const [fullscreenWindows, setFullscreenWindows] = useState({})

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight - 48 })
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Initialize new windows with cascading position
    useEffect(() => {
        const newStates = {}
        openWindows.forEach((menuName) => {
            if (!windowStates[menuName] && !fullscreenWindows[menuName]) {
                const cascade = (windowCounter++ % 6) * 30
                const w = Math.min(window.innerWidth * 0.65, 900)
                const h = Math.min((window.innerHeight - 48) * 0.75, 650)
                const maxX = window.innerWidth - w
                const maxY = window.innerHeight - 48 - h
                newStates[menuName] = {
                    width: w,
                    height: h,
                    x: Math.min(60 + cascade, maxX),
                    y: Math.min(30 + cascade, maxY),
                }
            }
        })
        if (Object.keys(newStates).length > 0) {
            setWindowStates((prev) => ({ ...prev, ...newStates }))
        }
    }, [openWindows])

    const handleClose = useCallback((menuName) => {
        closeWindow(menuName)
        setFullscreenWindows((prev) => {
            const next = { ...prev }; delete next[menuName]; return next
        })
        // Clean up state so reopening gets a fresh position
        setWindowStates((prev) => {
            const next = { ...prev }; delete next[menuName]; return next
        })
    }, [closeWindow])

    const handleFullscreen = useCallback((menuName) => {
        setFullscreenWindows((prev) => {
            const next = { ...prev }
            if (next[menuName]) delete next[menuName]
            else next[menuName] = true
            return next
        })
    }, [])

    const handleMinimize = useCallback((menuName) => {
        minimizeWindow(menuName)
        setFullscreenWindows((prev) => {
            const next = { ...prev }; delete next[menuName]; return next
        })
    }, [minimizeWindow])

    const handleStateCommit = useCallback((menuName, state) => {
        setWindowStates((prev) => ({ ...prev, [menuName]: state }))
    }, [])

    const visibleWindows = openWindows.filter(name => !minimizedWindows.includes(name))
    const fullscreenWindowsList = visibleWindows.filter(name => fullscreenWindows[name])
    const normalWindowsList = visibleWindows.filter(name => !fullscreenWindows[name])

    return (
        <>
            {/* Normal draggable windows — absolute overlay, no document flow impact */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: 'calc(100% - 48px)',
                zIndex: 20,
                overflow: 'hidden',
                pointerEvents: 'none',
            }}>
                <div style={{ width: '100%', height: '100%', position: 'relative', pointerEvents: 'auto' }}>
                    <AnimatePresence>
                        {normalWindowsList.map((menuName, index) => {
                            const state = windowStates[menuName]
                            if (!state) return null
                            return (
                                <DraggableWindow
                                    key={menuName}
                                    menuName={menuName}
                                    index={index}
                                    initialState={state}
                                    windowSize={windowSize}
                                    focusedWindow={focusedWindow}
                                    onFocus={onFocus}
                                    onClose={handleClose}
                                    onFullscreen={handleFullscreen}
                                    onMinimize={handleMinimize}
                                    onStateCommit={handleStateCommit}
                                />
                            )
                        })}
                    </AnimatePresence>
                </div>
            </div>

            {/* Fullscreen windows — fixed overlay */}
            <AnimatePresence>
                {fullscreenWindowsList.map((menuName) => (
                    <motion.div
                        key={`fs-${menuName}`}
                        className="windowFrame"
                        variants={fullscreenVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={() => onFocus(menuName)}
                        style={{
                            position: 'fixed', inset: 0,
                            width: '100vw', height: '100vh',
                            zIndex: 9999,
                            display: 'flex', flexDirection: 'column',
                            borderRadius: 0,
                        }}
                    >
                        <div className="windowHeader" style={{ cursor: 'default' }}>
                            <div className="windowTitle">
                                {windowIcons[menuName] && (
                                    <img src={windowIcons[menuName]} alt="" className="w-4 h-4 inline-block mr-2 filter brightness-0 invert opacity-80" style={{ verticalAlign: 'middle' }} />
                                )}
                                vintage Kayv / {menuName}
                            </div>
                            <div className="windowControls">
                                <button className="minimizeBtn" onClick={(e) => { e.stopPropagation(); handleMinimize(menuName) }} title="Minimize">
                                    <svg width="16" height="16" viewBox="0 0 16 16"><path d="M3 8h10" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg>
                                </button>
                                <button className="fullscreenBtn" onClick={(e) => { e.stopPropagation(); handleFullscreen(menuName) }} title="Exit Fullscreen">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M5.5 2.5h-3A1 1 0 0 0 1.5 3.5v3M10.5 2.5h3A1 1 0 0 1 14.5 3.5v3M5.5 13.5h-3A1 1 0 0 1 1.5 12.5v-3M10.5 13.5h3a1 1 0 0 0 1-1v-3" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                    </svg>
                                </button>
                                <button className="closeBtn" onClick={(e) => { e.stopPropagation(); handleClose(menuName) }}>
                                    <img src="icons/delete.png" alt="delete" />
                                </button>
                            </div>
                        </div>
                        <div className="windowContent project-container" style={{ flex: 1, overflow: 'auto' }}>
                            <WindowContent menuName={menuName} windowSize={{ width: window.innerWidth, height: window.innerHeight }} />
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </>
    )
}

export default WindowFrame
