import { m } from 'framer-motion'
import { Z_LAYERS } from '@/os/constants'
import WindowContent from '@/os/registry/windowRegistry'
import { WindowTitleBar } from './WindowChrome'

/** A window expanded to fill the viewport — no dragging, no resize handles. */
const FullscreenWindow = ({ id, onFocus, onClose, onFullscreen, onMinimize }) => (
  <m.div
    className="windowFrame"
    initial={{ opacity: 0, scale: 1.015 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 1.01, transition: { duration: 0.12, ease: 'easeIn' } }}
    transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
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
    <div className="windowContent project-container" style={{ flex: 1, overflow: 'auto' }}>
      <WindowContent id={id} />
    </div>
  </m.div>
)

export default FullscreenWindow
