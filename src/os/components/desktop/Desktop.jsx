import { useOS } from '@/os/hooks/useOS'
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
 * Takes no props — window focus and open state come from `useOS()`, so each
 * surface reads exactly what it needs instead of having callbacks threaded
 * down from the route.
 */
const Desktop = () => {
  const { wallpaper } = useOS()
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
