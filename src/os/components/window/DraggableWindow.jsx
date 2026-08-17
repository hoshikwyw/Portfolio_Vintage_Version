import { m, useDragControls, useMotionValue } from 'framer-motion'
import { RESIZE_DIRECTIONS, Z_LAYERS } from '@/os/constants'
import { windowTitleId } from '@/os/config/apps'
import { useResizable } from '@/os/hooks/useResizable'
import { useWindowA11y } from '@/os/hooks/useWindowA11y'
import WindowContent from '@/os/registry/windowRegistry'
import { WindowTitleBar } from './WindowChrome'

/**
 * A floating, draggable and resizable window.
 *
 * Dragging is tracked as an offset (`dragX`/`dragY`) separate from the
 * committed `x`/`y`, and reset to zero on drop — otherwise the re-render would
 * double-count the movement.
 */
const DraggableWindow = ({
  id, index, geometry, viewport, isFocused,
  onFocus, onClose, onFullscreen, onMinimize, onGeometryChange,
}) => {
  const { frameRef, handleKeyDown, handleFocus } = useWindowA11y({ id, onClose, onFocus })
  const dragControls = useDragControls()
  const dragX = useMotionValue(0)
  const dragY = useMotionValue(0)
  const { x, y, width, height } = geometry

  const focus = () => onFocus(id)

  const startResize = useResizable({
    geometry,
    viewport,
    onResizeStart: focus,
    onResize: (next) => onGeometryChange(id, next),
  })

  const handleDragEnd = () => {
    const nextX = Math.max(0, Math.min(x + dragX.get(), viewport.width - width))
    const nextY = Math.max(0, Math.min(y + dragY.get(), viewport.height - height))
    dragX.jump(0)
    dragY.jump(0)
    onGeometryChange(id, { width, height, x: nextX, y: nextY })
  }

  return (
    <m.div
      ref={frameRef}
      /*
       * Non-modal by design: several windows coexist and the desktop stays
       * usable behind them, so there is no `aria-modal` and no focus trap.
       */
      role="dialog"
      aria-labelledby={windowTitleId(id)}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      className="windowFrame resizable"
      // Only opacity and scale are animated: `y` is already bound to the
      // dragY motion value below, and animating it here would fight the drag.
      // Opening eases out over 0.22s; closing is quicker so dismissing feels
      // immediate.
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.1, ease: 'easeIn' } }}
      transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      onDragStart={focus}
      onDragEnd={handleDragEnd}
      onClick={focus}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        x: dragX,
        y: dragY,
        width,
        height,
        zIndex: isFocused ? Z_LAYERS.focusedWindow : Z_LAYERS.window + index,
        display: 'flex',
        flexDirection: 'column',
        pointerEvents: 'auto',
      }}
    >
      {RESIZE_DIRECTIONS.map((direction) => (
        <div
          key={direction}
          className={`resize-handle resize-${direction}`}
          onPointerDown={(e) => startResize(direction, e)}
        />
      ))}

      <WindowTitleBar
        id={id}
        onDragStart={(e) => dragControls.start(e)}
        onMinimize={onMinimize}
        onFullscreen={onFullscreen}
        onClose={onClose}
      />

      <div className="windowContent project-container" style={{ flex: 1, overflow: 'auto' }}>
        <WindowContent id={id} />
      </div>
    </m.div>
  )
}

export default DraggableWindow
