import { m } from 'framer-motion'
import { Z_LAYERS } from '@/os/constants'
import { windowTitleId } from '@/os/config/apps'
import { useWindowA11y } from '@/os/hooks/useWindowA11y'
import WindowContent from '@/os/registry/windowRegistry'
import { WindowTitleBar } from './WindowChrome'
import { fullscreenWindowMotion } from './windowMotion'

/** A window expanded to fill the viewport — no dragging, no resize handles. */
const FullscreenWindow = ({ id, onFocus, onClose, onFullscreen, onMinimize }) => {
  const { frameRef, handleKeyDown, handleFocus } = useWindowA11y({ id, onClose, onFocus })

  return (
  <m.div
    ref={frameRef}
    role="dialog"
    aria-labelledby={windowTitleId(id)}
    tabIndex={-1}
    onKeyDown={handleKeyDown}
    onFocus={handleFocus}
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
    <div className="windowContent project-container" style={{ flex: 1, overflow: 'auto' }}>
      <WindowContent id={id} />
    </div>
  </m.div>
  )
}

export default FullscreenWindow
