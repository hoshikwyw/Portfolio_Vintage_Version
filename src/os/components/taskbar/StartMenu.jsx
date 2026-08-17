import { useEffect, useRef, useState } from 'react'
import { m } from 'framer-motion'
import { Mail, Download, Search } from 'lucide-react'
import { useOSActions } from '@/os/hooks/useOS'
import { startMenuApps } from '@/os/config/apps'
import { Z_LAYERS } from '@/os/constants'
import { profile } from '@/shared/config/profile'
import { FONT_STACK } from '@/shared/constants/fonts'
import { downloadResume, openHireEmail, openGoogleSearch } from '@/shared/lib/browser'
import { useOutsideClick } from '@/shared/hooks/useOutsideClick'

// Highlight lives in `.start-menu-row` (see styles/index.css) rather than in
// JS mouse handlers, so it can ease instead of snapping.
const MenuRow = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="start-menu-row">
    {icon}
    <span className="text-[11px] font-semibold">{label}</span>
  </button>
)

const StartMenu = ({ onClose }) => {
  const { openWindow } = useOSActions()
  const [query, setQuery] = useState('')
  const ref = useOutsideClick(onClose)
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  /*
   * Arrow keys walk the rows, Escape dismisses. The rows are ordinary buttons,
   * so Enter and Space already activate them and Tab still works — this only
   * adds the vertical movement people expect from a menu.
   *
   * Deliberately not `role="menu"`: that pattern forbids a textbox among the
   * items, and the search field is the first thing here.
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
      return
    }
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return

    const rows = [...(ref.current?.querySelectorAll('.start-menu-row') ?? [])]
    if (!rows.length) return

    e.preventDefault()
    const delta = e.key === 'ArrowDown' ? 1 : -1
    const current = rows.indexOf(document.activeElement)
    // From the search field (index -1), ArrowDown enters the list at the top
    // and ArrowUp wraps to the bottom.
    const next = current === -1
      ? (delta === 1 ? 0 : rows.length - 1)
      : (current + delta + rows.length) % rows.length

    rows[next].focus()
  }

  const filtered = startMenuApps.filter((app) => app.label.toLowerCase().includes(query.toLowerCase()))

  /** Run an action then dismiss the menu. */
  const andClose = (action) => (...args) => { action(...args); onClose() }

  const openApp = andClose(openWindow)
  const handleSearch = andClose((e) => { e.preventDefault(); openGoogleSearch(query); setQuery('') })

  const actions = [
    { label: 'Download Resume', icon: <Download size={14} />, onClick: andClose(downloadResume) },
    { label: 'Hire Me', icon: <Mail size={14} />, onClick: andClose(() => openHireEmail({ subject: 'Hire Request' })) },
  ]

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      onKeyDown={handleKeyDown}
      aria-label="Start menu"
      className="absolute bottom-full left-0 mb-1 w-64 overflow-hidden start-menu-panel"
      style={{
        zIndex: Z_LAYERS.startMenu,
        background: 'var(--os-window)',
        border: '2px solid var(--os-border-dark)',
        borderTopColor: 'var(--os-border-light)',
        borderLeftColor: 'var(--os-border-light)',
        borderRadius: 'var(--os-window-radius)',
        boxShadow: 'var(--os-window-shadow)',
        backdropFilter: 'var(--os-glass-blur)',
        WebkitBackdropFilter: 'var(--os-glass-blur)',
        fontFamily: FONT_STACK,
      }}
    >
      <div className="flex">
        {/* Sidebar stripe — hidden in glass theme via CSS */}
        <div className="start-menu-sidebar w-7 flex items-end justify-center pb-2 flex-shrink-0" style={{ background: 'var(--os-accent)' }}>
          <span className="text-[8px] font-black text-white/60 tracking-widest" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>KAYV OS</span>
        </div>

        <div className="flex-1">
          {/* User */}
          <div className="px-3 py-2.5 flex items-center gap-2" style={{ borderBottom: '1px solid var(--os-border-dark)' }}>
            <div className="w-7 h-7 rounded-sm overflow-hidden" style={{ border: '1px solid var(--os-border-dark)' }}>
              <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-[11px] font-bold" style={{ color: 'var(--os-text)' }}>{profile.name}</p>
              <p className="text-[9px]" style={{ color: 'var(--os-text-secondary)' }}>{profile.role}</p>
            </div>
          </div>

          {/* Search */}
          <div className="px-3 py-2" style={{ borderBottom: '1px solid var(--os-border-dark)' }}>
            <form onSubmit={handleSearch} className="flex items-center gap-2 px-2 py-1" style={{ border: 'var(--os-input-border)', background: 'var(--os-input-bg)', borderRadius: 'var(--os-btn-radius)' }}>
              <Search size={12} style={{ color: 'var(--os-text-muted)' }} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                aria-label="Search apps and the web"
                className="flex-1 bg-transparent outline-none text-[11px]"
                style={{ color: 'var(--os-text)' }}
              />
            </form>
          </div>

          {/* Apps */}
          <div className="py-1">
            {filtered.map((app) => (
              <MenuRow
                key={app.id}
                label={app.label}
                icon={<img src={app.icon} alt="" className="w-5 h-5" />}
                onClick={() => openApp(app.id)}
              />
            ))}
          </div>

          <div className="mx-3" style={{ borderTop: '1px solid var(--os-border-dark)' }} />

          {/* Actions */}
          <div className="py-1">
            {actions.map((item) => (
              <MenuRow
                key={item.label}
                label={item.label}
                icon={<span style={{ opacity: 0.6 }}>{item.icon}</span>}
                onClick={item.onClick}
              />
            ))}
          </div>
        </div>
      </div>
    </m.div>
  )
}

export default StartMenu
