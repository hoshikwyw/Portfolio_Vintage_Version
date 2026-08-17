import { getAppLabel, windowTitleId } from '@/os/config/apps'
import AppIcon from '@/shared/components/icons/AppIcon'

/** Title-bar icon, inheriting the bar's own text colour. */
export const WindowIcon = ({ id }) => (
  <AppIcon id={id} size={14} className="inline-block mr-2 align-middle opacity-80" />
)

/** Minimize / fullscreen / close buttons shared by normal + fullscreen frames. */
export const WindowControls = ({ id, onMinimize, onFullscreen, onClose }) => {
  const handle = (action) => (e) => {
    e.stopPropagation()
    action(id)
  }

  return (
    <div className="windowControls">
      <button className="minimizeBtn" onClick={handle(onMinimize)} title="Minimize" aria-label={`Minimize ${getAppLabel(id)}`}>
        <svg width="10" height="10" viewBox="0 0 16 16"><path d="M3 8h10" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
      </button>
      <button className="fullscreenBtn" onClick={handle(onFullscreen)} title="Fullscreen" aria-label={`Toggle fullscreen for ${getAppLabel(id)}`}>
        <svg width="10" height="10" viewBox="0 0 16 16"><rect x="2" y="2" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
      </button>
      <button className="closeBtn" onClick={handle(onClose)} title="Close" aria-label={`Close ${getAppLabel(id)}`}>
        <svg width="10" height="10" viewBox="0 0 16 16"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
      </button>
    </div>
  )
}

/** Draggable title bar. `onDragStart` receives the pointer event to begin a drag. */
export const WindowTitleBar = ({ id, onDragStart, onMinimize, onFullscreen, onClose }) => (
  <div
    className="windowHeader"
    style={onDragStart ? undefined : { cursor: 'default' }}
    onPointerDown={(e) => {
      // Let the control buttons handle their own clicks.
      if (onDragStart && !e.target.closest('button')) onDragStart(e)
    }}
  >
    <div className="windowTitle" id={windowTitleId(id)}>
      <WindowIcon id={id} />
      {getAppLabel(id)}
    </div>
    <WindowControls id={id} onMinimize={onMinimize} onFullscreen={onFullscreen} onClose={onClose} />
  </div>
)
