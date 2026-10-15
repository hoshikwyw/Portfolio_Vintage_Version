import { m, useDragControls, useMotionValue } from 'framer-motion'
import { RESIZE_DIRECTIONS, Z_LAYERS } from '@/os/constants'
import { useResizable } from '@/os/hooks/useResizable'
import { useWindowA11y } from '@/os/hooks/useWindowA11y'
import { WindowBody, WindowTitleBar } from './WindowChrome'
import { floatingWindowMotion } from './windowMotion'

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
  const frameProps = useWindowA11y({ id, onClose, onFocus })
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
      {...frameProps}
      className="windowFrame"
      // Shared with the fullscreen frame; see ./windowMotion for why only
      // opacity and scale move.
      {...floatingWindowMotion}
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

      <WindowBody id={id} />
    </m.div>
  )
}

export default DraggableWindow
