import { useEffect, useMemo, useState } from 'react'
import { useOS } from '@/os/hooks/useOS'
import { Z_LAYERS } from '@/os/constants'
import { profile } from '@/shared/config/profile'
import { FONT_STACK } from '@/shared/constants/fonts'
import { RETRO_PALETTE as palette } from '@/shared/constants/palette'

const MENU_WIDTH = 180
const MENU_HEIGHT = 160

/** Surfaces that own their own context menu (or must not be overridden). */
const OPAQUE_TO_CONTEXT_MENU = ['.windowFrame', '.taskbar', '.desktop-icon', '[data-no-context]']

/** Right-click menu for the desktop background. */
const DesktopContextMenu = () => {
  const { openWindow } = useOS()
  const [position, setPosition] = useState(null)

  useEffect(() => {
    const handleContext = (e) => {
      // Only trigger on the desktop background, not on windows/taskbar/icons.
      if (OPAQUE_TO_CONTEXT_MENU.some((selector) => e.target.closest(selector))) return
      e.preventDefault()
      setPosition({ x: e.clientX, y: e.clientY })
    }

    const close = () => setPosition(null)

    document.addEventListener('contextmenu', handleContext)
    document.addEventListener('click', close)
    document.addEventListener('scroll', close)
    return () => {
      document.removeEventListener('contextmenu', handleContext)
      document.removeEventListener('click', close)
      document.removeEventListener('scroll', close)
    }
  }, [])

  const items = useMemo(() => [
    { label: 'Open About Me', action: () => openWindow('Home') },
    { label: 'Open Terminal', action: () => openWindow('Send-Message') },
    { divider: true },
    { label: 'Change Wallpaper', action: () => openWindow('Settings') },
    { divider: true },
    { label: 'View Source', action: () => window.open(profile.github, '_blank', 'noopener') },
    { label: 'About Kayv OS', action: () => openWindow('Settings') },
  ], [openWindow])

  if (!position) return null

  // Clamp so the menu doesn't overflow the viewport.
  const x = Math.min(position.x, window.innerWidth - MENU_WIDTH - 8)
  const y = Math.min(position.y, window.innerHeight - MENU_HEIGHT - 8)

  return (
    <div
      className="fixed"
      style={{
        left: x,
        top: y,
        zIndex: Z_LAYERS.contextMenu,
        background: palette.panel,
        border: `2px solid ${palette.borderDark}`,
        borderTopColor: palette.borderLight,
        borderLeftColor: palette.borderLight,
        borderRadius: '2px',
        boxShadow: '3px 3px 8px rgba(0,0,0,0.35)',
        fontFamily: FONT_STACK,
        minWidth: 170,
        padding: '3px 0',
      }}
    >
      {items.map((item, i) =>
        item.divider ? (
          <div
            key={`divider-${i}`}
            className="mx-2 my-1"
            style={{ borderTop: `1px solid ${palette.borderDark}`, borderBottom: `1px solid ${palette.borderLight}` }}
          />
        ) : (
          <button
            key={item.label}
            onClick={(e) => { e.stopPropagation(); item.action(); setPosition(null) }}
            className="w-full text-left px-4 py-1 text-[11px] text-[#2b2b3d] hover:bg-[#4a3aad] hover:text-white transition-colors cursor-pointer"
          >
            {item.label}
          </button>
        ),
      )}
    </div>
  )
}

export default DesktopContextMenu
