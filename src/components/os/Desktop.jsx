import { useEffect, useRef } from 'react'
import { useOS } from '@/context/OSContext'
import DesktopIcons from './DesktopIcons'
import StickyNote from './StickyNote'
import QuickActions from './QuickActions'
import WindowFrame from './WindowFrame'
import Taskbar from './Taskbar'
import DesktopContextMenu from './DesktopContextMenu'
import WelcomeDialog from './WelcomeDialog'

/**
 * The desktop environment: wallpaper background plus every shell surface
 * (icons, taskbar, windows, context menu). `focusedWindow` drives z-index
 * focus; `onFocus` bubbles focus changes up to <OSRoot>. `initialWindow`, when
 * set, opens that window once on mount (used by `/window/:appId` deep links).
 */
const Desktop = ({ focusedWindow, onFocus, initialWindow }) => {
  const { wallpaper, openWindow } = useOS()
  const wallpaperClass = wallpaper !== 'default' ? `wallpaper-${wallpaper}` : ''

  const handleOpenWindow = (id) => {
    openWindow(id)
    onFocus(id)
  }

  // Open the deep-linked window exactly once, after boot.
  const deepLinkOpened = useRef(false)
  useEffect(() => {
    if (initialWindow && !deepLinkOpened.current) {
      deepLinkOpened.current = true
      handleOpenWindow(initialWindow)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialWindow])

  return (
    <div className={`mainBackground ${wallpaperClass}`}>
      <div className="gradient-orb gradient-orb-1" />
      <div className="gradient-orb gradient-orb-2" />
      <div className="gradient-orb gradient-orb-3" />

      <DesktopIcons onFocus={onFocus} />
      <StickyNote />
      <QuickActions />
      <WindowFrame focusedWindow={focusedWindow} onFocus={onFocus} />
      <Taskbar onMenuClick={onFocus} />

      <DesktopContextMenu onOpenWindow={handleOpenWindow} />
      <WelcomeDialog onOpenWindow={handleOpenWindow} />
    </div>
  )
}

export default Desktop
