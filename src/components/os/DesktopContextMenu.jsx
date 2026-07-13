import { useState, useEffect, useRef } from 'react'
import { useOS } from '@/context/OSContext'
import { profile } from '@/config/profile'
import { FONT_STACK } from '@/constants/ui'

const MENU_WIDTH = 180
const MENU_HEIGHT = 160

export default function DesktopContextMenu({ onOpenWindow }) {
  const { openWindow } = useOS()
  const [menu, setMenu] = useState(null)
  const ref = useRef(null)

  useEffect(() => {
    const handleContext = (e) => {
      // Only trigger on the desktop background, not on windows/taskbar/icons.
      const target = e.target
      if (
        target.closest('.windowFrame') ||
        target.closest('.taskbar') ||
        target.closest('.desktop-icon') ||
        target.closest('[data-no-context]')
      ) {
        return
      }
      e.preventDefault()
      setMenu({ x: e.clientX, y: e.clientY })
    }

    const close = () => setMenu(null)

    document.addEventListener('contextmenu', handleContext)
    document.addEventListener('click', close)
    document.addEventListener('scroll', close)
    return () => {
      document.removeEventListener('contextmenu', handleContext)
      document.removeEventListener('click', close)
      document.removeEventListener('scroll', close)
    }
  }, [])

  if (!menu) return null

  // Open an app window and focus it.
  const open = (id) => () => { openWindow(id); onOpenWindow(id) }

  const items = [
    { label: 'Open About Me', action: open('Home') },
    { label: 'Open Terminal', action: open('Send-Message') },
    { divider: true },
    { label: 'Change Wallpaper', action: open('Settings') },
    { divider: true },
    { label: 'View Source', action: () => window.open(profile.github, '_blank', 'noopener') },
    { label: 'About Kayv OS', action: open('Settings') },
  ]

  // Clamp position so the menu doesn't overflow the viewport.
  const x = Math.min(menu.x, window.innerWidth - MENU_WIDTH - 8)
  const y = Math.min(menu.y, window.innerHeight - MENU_HEIGHT - 8)

  return (
    <div
      ref={ref}
      className="fixed z-[9990]"
      style={{
        left: x,
        top: y,
        background: '#c0b8a8',
        border: '2px solid #8a8070',
        borderTopColor: '#e0d8c8',
        borderLeftColor: '#e0d8c8',
        borderRadius: '2px',
        boxShadow: '3px 3px 8px rgba(0,0,0,0.35)',
        fontFamily: FONT_STACK,
        minWidth: 170,
        padding: '3px 0',
      }}
    >
      {items.map((item, i) =>
        item.divider ? (
          <div key={i} className="mx-2 my-1" style={{ borderTop: '1px solid #8a8070', borderBottom: '1px solid #e0d8c8' }} />
        ) : (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); item.action(); setMenu(null) }}
            className="w-full text-left px-4 py-1 text-[11px] text-[#2b2b3d] hover:bg-[#4a3aad] hover:text-white transition-colors cursor-pointer"
          >
            {item.label}
          </button>
        ),
      )}
    </div>
  )
}
