import { motion } from 'framer-motion'
import { Z_LAYERS } from '@/os/constants'
import WindowContent from '@/os/registry/windowRegistry'
import { WindowTitleBar } from './WindowChrome'

/** A window expanded to fill the viewport — no dragging, no resize handles. */
const FullscreenWindow = ({ id, onFocus, onClose, onFullscreen, onMinimize }) => (
  <motion.div
    className="windowFrame"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
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
  </motion.div>
)

export default FullscreenWindow
