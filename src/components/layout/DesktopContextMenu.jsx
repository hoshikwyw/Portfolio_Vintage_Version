import { useState, useEffect, useRef, useContext } from 'react'
import { MenuContext } from '../../context/MenuContext'

export default function DesktopContextMenu({ onOpenWindow }) {
    const { openWindow } = useContext(MenuContext)
    const [menu, setMenu] = useState(null)
    const ref = useRef(null)

    useEffect(() => {
        const handleContext = (e) => {
            // Only trigger on the desktop background, not on windows/taskbar/icons
            const target = e.target
            if (target.closest('.windowFrame') || target.closest('.taskbar') ||
                target.closest('.desktop-icon') || target.closest('[data-no-context]')) {
                return
            }
            e.preventDefault()
            setMenu({ x: e.clientX, y: e.clientY })
        }

        const handleClick = () => setMenu(null)
        const handleScroll = () => setMenu(null)

        document.addEventListener('contextmenu', handleContext)
        document.addEventListener('click', handleClick)
        document.addEventListener('scroll', handleScroll)
        return () => {
            document.removeEventListener('contextmenu', handleContext)
            document.removeEventListener('click', handleClick)
            document.removeEventListener('scroll', handleScroll)
        }
    }, [])

    if (!menu) return null

    // Clamp position so menu doesn't overflow viewport
    const menuW = 180, menuH = 160
    const x = Math.min(menu.x, window.innerWidth - menuW - 8)
    const y = Math.min(menu.y, window.innerHeight - menuH - 8)

    const items = [
        { label: 'Open About Me', action: () => { openWindow('Home'); onOpenWindow('Home') } },
        { label: 'Open Terminal', action: () => { openWindow('Send-Message'); onOpenWindow('Send-Message') } },
        { divider: true },
        { label: 'Change Wallpaper', action: () => { openWindow('Settings'); onOpenWindow('Settings') } },
        { divider: true },
        { label: 'View Source', action: () => window.open('https://github.com/hoshikwyw', '_blank', 'noopener') },
        { label: 'About Kayv OS', action: () => { openWindow('Settings'); onOpenWindow('Settings') } },
    ]

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
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
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
                )
            )}
        </div>
    )
}
