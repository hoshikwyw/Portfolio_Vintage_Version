import { useContext, useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MenuContext } from '../../context/MenuContext'
import { Mail, Download, Search } from 'lucide-react'

const apps = [
    { name: 'Home', icon: 'icons/home.svg', label: 'About Me' },
    { name: 'Projects', icon: 'icons/openFolder.svg', label: 'Projects' },
    { name: 'Gallery', icon: 'icons/gallery.svg', label: 'Gallery' },
    { name: 'Send-Message', icon: 'icons/terminal.svg', label: 'Terminal' },
    { name: 'Settings', icon: 'icons/settings.svg', label: 'Settings' },
]

export default function StartMenu({ onClose, onFocus }) {
    const { openWindow } = useContext(MenuContext)
    const [query, setQuery] = useState('')
    const ref = useRef(null)
    const inputRef = useRef(null)

    useEffect(() => { inputRef.current?.focus() }, [])
    useEffect(() => {
        const handle = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose() }
        document.addEventListener('mousedown', handle)
        return () => document.removeEventListener('mousedown', handle)
    }, [onClose])

    const filtered = apps.filter(a => a.label.toLowerCase().includes(query.toLowerCase()))
    const openApp = (name) => { openWindow(name); onFocus(name); onClose() }

    const handleSearch = (e) => { e.preventDefault(); if (!query.trim()) return; window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank', 'noopener'); setQuery(''); onClose() }
    const handleHire = () => { const e = 'khaingwutyiwin1712@gmail.com'; window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(e)}&su=${encodeURIComponent('Hire Request')}`, '_blank', 'noopener'); onClose() }
    const handleResume = () => { const a = document.createElement('a'); a.href = '/KhaingWutYiWinResume.pdf'; a.download = 'KhaingWutYiWinResume.pdf'; document.body.appendChild(a); a.click(); document.body.removeChild(a); onClose() }

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-0 mb-1 w-64 overflow-hidden z-[9999] start-menu-panel"
            style={{
                background: 'var(--os-window)',
                border: '2px solid var(--os-border-dark)',
                borderTopColor: 'var(--os-border-light)',
                borderLeftColor: 'var(--os-border-light)',
                borderRadius: 'var(--os-window-radius)',
                boxShadow: 'var(--os-window-shadow)',
                backdropFilter: 'var(--os-glass-blur)',
                WebkitBackdropFilter: 'var(--os-glass-blur)',
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
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
                            <img src="/myPf.png" alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold" style={{ color: 'var(--os-text)' }}>Khaing Wut Yi Win</p>
                            <p className="text-[9px]" style={{ color: 'var(--os-text-secondary)' }}>Frontend Developer</p>
                        </div>
                    </div>
                    {/* Search */}
                    <div className="px-3 py-2" style={{ borderBottom: '1px solid var(--os-border-dark)' }}>
                        <form onSubmit={handleSearch} className="flex items-center gap-2 px-2 py-1" style={{ border: 'var(--os-input-border)', background: 'var(--os-input-bg)', borderRadius: 'var(--os-btn-radius)' }}>
                            <Search size={12} style={{ color: 'var(--os-text-muted)' }} />
                            <input ref={inputRef} type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search..."
                                className="flex-1 bg-transparent outline-none text-[11px]" style={{ color: 'var(--os-text)' }} />
                        </form>
                    </div>
                    {/* Apps */}
                    <div className="py-1">
                        {filtered.map(app => (
                            <button key={app.name} onClick={() => openApp(app.name)}
                                className="flex items-center gap-2 w-full px-3 py-1.5 transition-colors cursor-pointer text-left group"
                                style={{ color: 'var(--os-text)' }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'var(--os-accent)'; e.currentTarget.style.color = '#fff' }}
                                onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--os-text)' }}
                            >
                                <img src={app.icon} alt="" className="w-5 h-5" style={{ filter: 'brightness(0)', opacity: 0.6 }} />
                                <span className="text-[11px] font-semibold">{app.label}</span>
                            </button>
                        ))}
                    </div>
                    <div className="mx-3" style={{ borderTop: '1px solid var(--os-border-dark)' }} />
                    {/* Actions */}
                    <div className="py-1">
                        {[{ label: 'Download Resume', icon: <Download size={14} />, action: handleResume }, { label: 'Hire Me', icon: <Mail size={14} />, action: handleHire }].map(item => (
                            <button key={item.label} onClick={item.action}
                                className="flex items-center gap-2 w-full px-3 py-1.5 transition-colors cursor-pointer"
                                style={{ color: 'var(--os-text)' }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'var(--os-accent)'; e.currentTarget.style.color = '#fff' }}
                                onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--os-text)' }}
                            >
                                <span style={{ opacity: 0.6 }}>{item.icon}</span>
                                <span className="text-[11px] font-semibold">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
