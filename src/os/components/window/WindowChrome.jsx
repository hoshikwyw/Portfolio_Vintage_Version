import { getApp, getAppIcon } from '@/os/config/apps'
import LockIcon from '@/shared/components/ui/LockIcon'

/** Title-bar icon: the padlock for locked apps, otherwise the app's SVG. */
export const WindowIcon = ({ id }) => {
  if (getApp(id)?.locked) return <LockIcon variant="inline" />

  const icon = getAppIcon(id)
  if (!icon) return null

  return (
    <img
      src={icon}
      alt=""
      className="w-3.5 h-3.5 inline-block mr-2 filter brightness-0 invert opacity-70"
      style={{ verticalAlign: 'middle' }}
    />
  )
}

/** Minimize / fullscreen / close buttons shared by normal + fullscreen frames. */
export const WindowControls = ({ id, onMinimize, onFullscreen, onClose }) => {
  const handle = (action) => (e) => {
    e.stopPropagation()
    action(id)
  }

  return (
    <div className="windowControls">
      <button className="minimizeBtn" onClick={handle(onMinimize)} title="Minimize">
        <svg width="10" height="10" viewBox="0 0 16 16"><path d="M3 8h10" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
      </button>
      <button className="fullscreenBtn" onClick={handle(onFullscreen)} title="Fullscreen">
        <svg width="10" height="10" viewBox="0 0 16 16"><rect x="2" y="2" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
      </button>
      <button className="closeBtn" onClick={handle(onClose)} title="Close">
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
    <div className="windowTitle">
      <WindowIcon id={id} />
      {id}
    </div>
    <WindowControls id={id} onMinimize={onMinimize} onFullscreen={onFullscreen} onClose={onClose} />
  </div>
)
