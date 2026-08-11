import { useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useOSActions, useOSWindows } from '@/os/hooks/useOS'
import { useViewportSize } from '@/os/hooks/useViewportSize'
import { useWindowLayout } from '@/os/hooks/useWindowLayout'
import { TASKBAR_HEIGHT, Z_LAYERS } from '@/os/constants'
import DraggableWindow from './DraggableWindow'
import FullscreenWindow from './FullscreenWindow'

/**
 * Renders every visible window. Owns nothing about *which* windows exist (that
 * is the window manager) — only how they are laid out and stacked.
 */
const WindowLayer = () => {
  const { openWindows, visibleWindows, focusedWindow } = useOSWindows()
  const { closeWindow, minimizeWindow, focusWindow } = useOSActions()

  const viewport = useViewportSize()
  const {
    geometries, fullscreen, setGeometry,
    forgetWindow, toggleFullscreen, exitFullscreen,
  } = useWindowLayout(openWindows)

  const handleClose = useCallback((id) => {
    closeWindow(id)
    forgetWindow(id)
  }, [closeWindow, forgetWindow])

  const handleMinimize = useCallback((id) => {
    minimizeWindow(id)
    exitFullscreen(id)
  }, [minimizeWindow, exitFullscreen])

  const floating = visibleWindows.filter((id) => !fullscreen[id] && geometries[id])
  const maximized = visibleWindows.filter((id) => fullscreen[id])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: `calc(100vh - ${TASKBAR_HEIGHT}px)`,
        zIndex: Z_LAYERS.windowLayer,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <div style={{ width: '100%', height: '100%', position: 'relative', pointerEvents: 'none', overflow: 'hidden' }}>
        <AnimatePresence>
          {floating.map((id, index) => (
            <DraggableWindow
              key={id}
              id={id}
              index={index}
              geometry={geometries[id]}
              viewport={viewport}
              isFocused={focusedWindow === id}
              onFocus={focusWindow}
              onClose={handleClose}
              onFullscreen={toggleFullscreen}
              onMinimize={handleMinimize}
              onGeometryChange={setGeometry}
            />
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {maximized.map((id) => (
          <FullscreenWindow
            key={`fs-${id}`}
            id={id}
            onFocus={focusWindow}
            onClose={handleClose}
            onFullscreen={toggleFullscreen}
            onMinimize={handleMinimize}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

export default WindowLayer
