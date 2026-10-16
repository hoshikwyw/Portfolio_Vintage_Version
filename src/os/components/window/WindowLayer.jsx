import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useOSActions, useOSWindows } from '@/os/hooks/useOS'
import { useViewportSize } from '@/os/hooks/useViewportSize'
import { useWindowLayout } from '@/os/hooks/useWindowLayout'
import { TASKBAR_HEIGHT, Z_LAYERS } from '@/os/constants'
import { windowTitleId } from '@/os/config/apps'
import WindowFrame from './WindowFrame'
import { snapRect } from './snap'

/**
 * Renders every visible window. Owns nothing about *which* windows exist (that
 * is the window manager) — only how they are laid out and stacked.
 */
const WindowLayer = () => {
  const { openWindows, visibleWindows, focusedWindow } = useOSWindows()
  const { closeWindow, minimizeWindow, focusWindow, activateWindow } = useOSActions()
  const [snapPreview, setSnapPreview] = useState(null)

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

  /** Apply a snap: halves become geometry, the top edge maximizes. */
  const handleSnap = useCallback((id, zone) => {
    if (zone === 'top') toggleFullscreen(id)
    else setGeometry(id, snapRect(zone, viewport))
  }, [toggleFullscreen, setGeometry, viewport])

  /*
   * Alt+` cycles through open windows (Alt+Shift+` backwards), restoring a
   * minimized one, and moves keyboard focus into it. Alt+Tab would be the
   * obvious key, but the operating system takes it before the page ever sees
   * it — Alt+` is the macOS window-cycling key.
   */
  useEffect(() => {
    const handleKey = (event) => {
      if (!event.altKey || event.code !== 'Backquote' || !openWindows.length) return
      event.preventDefault()
      const step = event.shiftKey ? -1 : 1
      const from = openWindows.indexOf(focusedWindow)
      const next = openWindows[(from + step + openWindows.length) % openWindows.length]
      activateWindow(next)
      // After the render that raises (or restores) it.
      requestAnimationFrame(() => {
        document.querySelector(`[aria-labelledby="${windowTitleId(next)}"]`)?.focus({ preventScroll: true })
      })
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [openWindows, focusedWindow, activateWindow])

  // Geometry is assigned in an effect, so a just-opened window waits a frame.
  const placed = visibleWindows.filter((id) => geometries[id])
  // Stacking order among the floating windows only; fullscreen sits above them.
  const floatingOrder = placed.filter((id) => !fullscreen[id])

  return (
    <div
      className="os-window-layer"
      /*
       * Published for CSS, so surfaces outside the layer can react without
       * being wired to window state — the helper bot steps aside with these.
       */
      data-has-windows={placed.length > 0 || undefined}
      data-fullscreen={placed.some((id) => fullscreen[id]) || undefined}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        // dvh: the area a phone actually shows, excluding its browser toolbar.
        height: `calc(100dvh - ${TASKBAR_HEIGHT}px)`,
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
              onSnapPreview={setSnapPreview}
              onSnap={handleSnap}
            />
          ))}
        </AnimatePresence>

        {/* Where a dragged window will land if released here. */}
        {snapPreview && (
          <div
            className="os-snap-preview"
            aria-hidden="true"
            style={(({ x, y, width, height }) => ({
              // Inset 6px so it reads as a target rather than a wall.
              left: x + 6,
              top: y + 6,
              width: width - 12,
              height: height - 12,
              // Above the other windows, below the one being dragged (focused).
              zIndex: Z_LAYERS.focusedWindow - 1,
            }))(snapRect(snapPreview, viewport))}
          />
        )}
      </div>
    </div>
  )
}

export default WindowLayer
