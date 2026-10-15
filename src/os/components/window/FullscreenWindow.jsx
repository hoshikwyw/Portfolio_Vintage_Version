import { m } from 'framer-motion'
import { Z_LAYERS } from '@/os/constants'
import { useWindowA11y } from '@/os/hooks/useWindowA11y'
import { WindowBody, WindowTitleBar } from './WindowChrome'
import { fullscreenWindowMotion } from './windowMotion'

/** A window expanded to fill the viewport — no dragging, no resize handles. */
const FullscreenWindow = ({ id, onFocus, onClose, onFullscreen, onMinimize }) => {
  const frameProps = useWindowA11y({ id, onClose, onFocus })

  return (
    <m.div
      {...frameProps}
      className="windowFrame"
      {...fullscreenWindowMotion}
      onClick={() => onFocus(id)}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: Z_LAYERS.fullscreenWindow,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 0,
        pointerEvents: 'auto',
      }}
    >
      <WindowTitleBar
        id={id}
        onMinimize={onMinimize}
        onFullscreen={onFullscreen}
        onClose={onClose}
      />
      <WindowBody id={id} />
    </m.div>
  )
}

export default FullscreenWindow
