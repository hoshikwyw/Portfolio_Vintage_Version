import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useDragControls, useMotionValue } from 'framer-motion'
import { useOS } from '@/context/OSContext'
import { getApp, getAppIcon } from '@/config/apps'
import LockIcon from '@/shared/components/ui/LockIcon'
import WindowContent from '@/components/windows/registry'

const MIN_WIDTH = 400
const MIN_HEIGHT = 300
const TASKBAR_HEIGHT = 42

// Title-bar icon: the padlock for locked apps, otherwise the app's SVG.
const WindowIcon = ({ id }) =>
  getApp(id)?.locked ? (
    <LockIcon variant="inline" />
  ) : getAppIcon(id) ? (
    <img
      src={getAppIcon(id)}
      alt=""
      className="w-3.5 h-3.5 inline-block mr-2 filter brightness-0 invert opacity-70"
      style={{ verticalAlign: 'middle' }}
    />
  ) : null

// Minimize / fullscreen / close buttons shared by normal + fullscreen frames.
const WindowControls = ({ id, onMinimize, onFullscreen, onClose }) => (
  <div className="windowControls">
    <button className="minimizeBtn" onClick={(e) => { e.stopPropagation(); onMinimize(id) }} title="Minimize">
      <svg width="10" height="10" viewBox="0 0 16 16"><path d="M3 8h10" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
    </button>
    <button className="fullscreenBtn" onClick={(e) => { e.stopPropagation(); onFullscreen(id) }} title="Fullscreen">
      <svg width="10" height="10" viewBox="0 0 16 16"><rect x="2" y="2" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
    </button>
    <button className="closeBtn" onClick={(e) => { e.stopPropagation(); onClose(id) }} title="Close">
      <svg width="10" height="10" viewBox="0 0 16 16"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
    </button>
  </div>
)

const DraggableWindow = ({
  menuName, index, state, windowSize,
  focusedWindow, onFocus, onClose, onFullscreen, onMinimize, onStateUpdate,
}) => {
  const dragControls = useDragControls()
  const resizeRef = useRef(null)
  const rafRef = useRef(null)
  const { x, y, width, height } = state

  // Drag offset — separate from position. Reset to 0 after each drag.
  const dragX = useMotionValue(0)
  const dragY = useMotionValue(0)

  const startResize = useCallback((direction, e) => {
    e.preventDefault()
    e.stopPropagation()
    onFocus(menuName)

    resizeRef.current = { direction, startMouseX: e.clientX, startMouseY: e.clientY, origW: width, origH: height, origX: x, origY: y }

    const handleMouseMove = (e) => {
      if (!resizeRef.current) return
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const r = resizeRef.current
        if (!r) return
        const dx = e.clientX - r.startMouseX, dy = e.clientY - r.startMouseY
        let nw = r.origW, nh = r.origH, nx = r.origX, ny = r.origY

        if (r.direction.includes('right')) nw = Math.min(Math.max(r.origW + dx, MIN_WIDTH), windowSize.width - r.origX)
        if (r.direction.includes('left')) { nw = Math.min(Math.max(r.origW - dx, MIN_WIDTH), r.origX + r.origW); nx = r.origX + (r.origW - nw) }
        if (r.direction.includes('bottom')) nh = Math.min(Math.max(r.origH + dy, MIN_HEIGHT), windowSize.height - r.origY)
        if (r.direction.includes('top')) { nh = Math.min(Math.max(r.origH - dy, MIN_HEIGHT), r.origY + r.origH); ny = r.origY + (r.origH - nh) }

        nx = Math.max(0, nx)
        ny = Math.max(0, ny)

        onStateUpdate(menuName, { width: nw, height: nh, x: nx, y: ny })
      })
    }

    const handleMouseUp = () => {
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
  }, [menuName, width, height, x, y, windowSize, onFocus, onStateUpdate])

  return (
    <motion.div
      className="windowFrame resizable"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.12 }}
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      onDragStart={() => onFocus(menuName)}
      onDragEnd={() => {
        const dx = dragX.get()
        const dy = dragY.get()
        const newX = Math.max(0, Math.min(x + dx, windowSize.width - width))
        const newY = Math.max(0, Math.min(y + dy, windowSize.height - height))
        // Reset the drag offset BEFORE committing the new left/top so the
        // re-render does not double-count the movement.
        dragX.jump(0)
        dragY.jump(0)
        onStateUpdate(menuName, { width, height, x: newX, y: newY })
      }}
      onClick={() => onFocus(menuName)}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        x: dragX,
        y: dragY,
        width,
        height,
        zIndex: focusedWindow === menuName ? 1000 : 100 + index,
        display: 'flex',
        flexDirection: 'column',
        pointerEvents: 'auto',
      }}
    >
      {['top', 'right', 'bottom', 'left', 'top-left', 'top-right', 'bottom-left', 'bottom-right'].map((dir) => (
        <div key={dir} className={`resize-handle resize-${dir}`} onMouseDown={(e) => startResize(dir, e)} />
      ))}

      <div className="windowHeader" onPointerDown={(e) => { if (!e.target.closest('button')) dragControls.start(e) }}>
        <div className="windowTitle">
          <WindowIcon id={menuName} />
          {menuName}
        </div>
        <WindowControls id={menuName} onMinimize={onMinimize} onFullscreen={onFullscreen} onClose={onClose} />
      </div>

      <div className="windowContent project-container" style={{ flex: 1, overflow: 'auto' }}>
        <WindowContent id={menuName} windowSize={windowSize} />
      </div>
    </motion.div>
  )
}

let windowCounter = 0

const WindowFrame = ({ focusedWindow, onFocus }) => {
  const { openWindows, minimizedWindows, closeWindow, minimizeWindow } = useOS()
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight - TASKBAR_HEIGHT,
  })
  const [windowStates, setWindowStates] = useState({})
  const [fullscreenWindows, setFullscreenWindows] = useState({})

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight - TASKBAR_HEIGHT })
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Give each newly opened window a cascading initial position + size.
  useEffect(() => {
    const newStates = {}
    const areaW = window.innerWidth
    const areaH = window.innerHeight - TASKBAR_HEIGHT
    openWindows.forEach((menuName) => {
      if (!windowStates[menuName] && !fullscreenWindows[menuName]) {
        const cascade = (windowCounter++ % 5) * 28
        const w = Math.min(areaW * 0.55, 800)
        const h = Math.min(areaH * 0.65, 550)
        newStates[menuName] = {
          width: w, height: h,
          x: Math.max(0, Math.min(70 + cascade, areaW - w)),
          y: Math.max(0, Math.min(15 + cascade, areaH - h)),
        }
      }
    })
    if (Object.keys(newStates).length > 0) setWindowStates((prev) => ({ ...prev, ...newStates }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openWindows])

  const handleClose = useCallback((menuName) => {
    closeWindow(menuName)
    setFullscreenWindows((prev) => { const n = { ...prev }; delete n[menuName]; return n })
    setWindowStates((prev) => { const n = { ...prev }; delete n[menuName]; return n })
  }, [closeWindow])

  const handleFullscreen = useCallback((menuName) => {
    setFullscreenWindows((prev) => { const n = { ...prev }; if (n[menuName]) delete n[menuName]; else n[menuName] = true; return n })
  }, [])

  const handleMinimize = useCallback((menuName) => {
    minimizeWindow(menuName)
    setFullscreenWindows((prev) => { const n = { ...prev }; delete n[menuName]; return n })
  }, [minimizeWindow])

  const handleStateUpdate = useCallback((menuName, state) => {
    setWindowStates((prev) => ({ ...prev, [menuName]: state }))
  }, [])

  const visibleWindows = openWindows.filter((n) => !minimizedWindows.includes(n))
  const fullscreenWindowsList = visibleWindows.filter((n) => fullscreenWindows[n])
  const normalWindowsList = visibleWindows.filter((n) => !fullscreenWindows[n])

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: `calc(100vh - ${TASKBAR_HEIGHT}px)`, zIndex: 20, pointerEvents: 'none', overflow: 'hidden' }}>
      <div style={{ width: '100%', height: '100%', position: 'relative', pointerEvents: 'none', overflow: 'hidden' }}>
        <AnimatePresence>
          {normalWindowsList.map((menuName, index) => {
            const state = windowStates[menuName]
            if (!state) return null
            return (
              <DraggableWindow
                key={menuName}
                menuName={menuName}
                index={index}
                state={state}
                windowSize={windowSize}
                focusedWindow={focusedWindow}
                onFocus={onFocus}
                onClose={handleClose}
                onFullscreen={handleFullscreen}
                onMinimize={handleMinimize}
                onStateUpdate={handleStateUpdate}
              />
            )
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {fullscreenWindowsList.map((menuName) => (
          <motion.div
            key={`fs-${menuName}`}
            className="windowFrame"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => onFocus(menuName)}
            style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', zIndex: 9999, display: 'flex', flexDirection: 'column', borderRadius: 0, pointerEvents: 'auto' }}
          >
            <div className="windowHeader" style={{ cursor: 'default' }}>
              <div className="windowTitle">
                <WindowIcon id={menuName} />
                {menuName}
              </div>
              <WindowControls id={menuName} onMinimize={handleMinimize} onFullscreen={handleFullscreen} onClose={handleClose} />
            </div>
            <div className="windowContent project-container" style={{ flex: 1, overflow: 'auto' }}>
              <WindowContent id={menuName} windowSize={{ width: window.innerWidth, height: window.innerHeight }} />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default WindowFrame
