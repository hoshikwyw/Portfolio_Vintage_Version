import { useOSAppearance } from '@/os/hooks/useOS'
import Taskbar from '@/os/components/taskbar/Taskbar'
import WindowLayer from '@/os/components/window/WindowLayer'
import { DEFAULT_WALLPAPER } from '@/shared/config/theme'
import DesktopIcons from './DesktopIcons'
import StickyNote from './StickyNote'
import QuickActions from './QuickActions'
import DesktopContextMenu from './DesktopContextMenu'
import WelcomeDialog from './WelcomeDialog'

/**
 * The desktop environment: wallpaper background plus every shell surface
 * (icons, taskbar, windows, context menu).
 *
 * Takes no props — each surface reads exactly what it needs from the OS
 * context hooks instead of having callbacks threaded down from the route.
 *
 * This component itself subscribes only to appearance, so opening, closing or
 * focusing a window no longer re-renders the whole desktop tree beneath it.
 */
const Desktop = () => {
  const { wallpaper } = useOSAppearance()
  const wallpaperClass = wallpaper !== DEFAULT_WALLPAPER ? `wallpaper-${wallpaper}` : ''

  return (
    <div className={`mainBackground ${wallpaperClass}`}>
      <div className="gradient-orb gradient-orb-1" />
      <div className="gradient-orb gradient-orb-2" />
      <div className="gradient-orb gradient-orb-3" />

      <DesktopIcons />
      <StickyNote />
      <QuickActions />
      <WindowLayer />
      <Taskbar />

      <DesktopContextMenu />
      <WelcomeDialog />
    </div>
  )
}

export default Desktop
