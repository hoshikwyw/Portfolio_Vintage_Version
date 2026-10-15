import { m, useDragControls, useMotionValue } from 'framer-motion'
import { RESIZE_DIRECTIONS, Z_LAYERS } from '@/os/constants'
import { useResizable } from '@/os/hooks/useResizable'
import { useWindowA11y } from '@/os/hooks/useWindowA11y'
import { WindowBody, WindowTitleBar } from './WindowChrome'
import { floatingWindowMotion, fullscreenWindowMotion } from './windowMotion'

/** Style for a window filling the viewport. */
const FULLSCREEN_STYLE = {
  position: 'fixed',
  inset: 0,
  width: '100vw',
  height: '100vh',
  zIndex: Z_LAYERS.fullscreenWindow,
  borderRadius: 0,
}

/**
 * One window, floating or fullscreen.
 *
 * Both modes are the same element. They used to be two components —
 * `DraggableWindow` and `FullscreenWindow`, rendered in separate lists — so
 * toggling fullscreen unmounted the app inside and mounted a fresh one: the
 * terminal lost its history, a Minesweeper game restarted, a half-typed admin
 * form emptied. Keeping one element under one key keeps the app mounted.
 *
 * Floating, it drags by its title bar and resizes from any edge. Dragging is
 * tracked as an offset (`dragX`/`dragY`) separate from the committed `x`/`y`,
 * and reset to zero on drop — otherwise the re-render would double-count the
 * movement. Fullscreen, it fills the viewport with no drag and no handles,
 * and its floating geometry is kept for when it is restored.
 */
const WindowFrame = ({
  id, index, geometry, viewport, isFocused, isFullscreen,
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

  const placement = isFullscreen
    ? FULLSCREEN_STYLE
    : {
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        zIndex: isFocused ? Z_LAYERS.focusedWindow : Z_LAYERS.window + index,
      }

  return (
    <m.div
      {...frameProps}
      className="windowFrame"
      // See ./windowMotion for why only opacity and scale move. The variant
      // only matters on mount and unmount: toggling fullscreen changes
      // neither target, so the switch itself is immediate.
      {...(isFullscreen ? fullscreenWindowMotion : floatingWindowMotion)}
      drag={!isFullscreen}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      onDragStart={focus}
      onDragEnd={handleDragEnd}
      onClick={focus}
      style={{
        ...placement,
        x: dragX,
        y: dragY,
        display: 'flex',
        flexDirection: 'column',
        pointerEvents: 'auto',
      }}
    >
      {!isFullscreen && RESIZE_DIRECTIONS.map((direction) => (
        <div
          key={direction}
          className={`resize-handle resize-${direction}`}
          onPointerDown={(e) => startResize(direction, e)}
        />
      ))}

      <WindowTitleBar
        id={id}
        onDragStart={isFullscreen ? undefined : (e) => dragControls.start(e)}
        onMinimize={onMinimize}
        onFullscreen={onFullscreen}
        onClose={onClose}
      />

      <WindowBody id={id} />
    </m.div>
  )
}

export default WindowFrame
