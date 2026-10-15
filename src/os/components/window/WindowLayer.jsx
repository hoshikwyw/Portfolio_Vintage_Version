import { useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useOSActions, useOSWindows } from '@/os/hooks/useOS'
import { useViewportSize } from '@/os/hooks/useViewportSize'
import { useWindowLayout } from '@/os/hooks/useWindowLayout'
import { TASKBAR_HEIGHT, Z_LAYERS } from '@/os/constants'
import WindowFrame from './WindowFrame'

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

  // Geometry is assigned in an effect, so a just-opened window waits a frame.
  const placed = visibleWindows.filter((id) => geometries[id])
  // Stacking order among the floating windows only; fullscreen sits above them.
  const floatingOrder = placed.filter((id) => !fullscreen[id])

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
      {/*
        One list for floating and fullscreen windows alike, so a window keeps
        its key — and the app inside keeps its state — when it changes mode.
        A fullscreen frame is `position: fixed`, which escapes this box's
        clipping because no ancestor sets a transform.
      */}
      <div style={{ width: '100%', height: '100%', position: 'relative', pointerEvents: 'none', overflow: 'hidden' }}>
        <AnimatePresence>
          {placed.map((id) => (
            <WindowFrame
              key={id}
              id={id}
              index={floatingOrder.indexOf(id)}
              geometry={geometries[id]}
              viewport={viewport}
              isFocused={focusedWindow === id}
              isFullscreen={Boolean(fullscreen[id])}
              onFocus={focusWindow}
              onClose={handleClose}
              onFullscreen={toggleFullscreen}
              onMinimize={handleMinimize}
              onGeometryChange={setGeometry}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default WindowLayer
