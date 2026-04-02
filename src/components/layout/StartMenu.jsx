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

    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    // Close on outside click
    useEffect(() => {
        const handle = (e) => {
            if (ref.current && !ref.current.contains(e.target)) onClose()
        }
        document.addEventListener('mousedown', handle)
        return () => document.removeEventListener('mousedown', handle)
    }, [onClose])

    const filtered = apps.filter((a) =>
        a.label.toLowerCase().includes(query.toLowerCase())
    )

    const openApp = (name) => {
        openWindow(name)
        onFocus(name)
        onClose()
    }

    const handleSearch = (e) => {
        e.preventDefault()
        if (!query.trim()) return
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank', 'noopener,noreferrer')
        setQuery('')
        onClose()
    }

    const handleHire = () => {
        const email = 'khaingwutyiwin1712@gmail.com'
        const subject = 'Hire Request - Frontend Developer'
        const body = `Hello Khaing Wut Yi Win,\n\nI am interested in discussing a potential opportunity with you.\n\nProject Details:\n- Project Type:\n- Timeline:\n- Budget:\n\nBest regards,\n[Your Name]`
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank', 'noopener,noreferrer')
        onClose()
    }

    const handleResume = () => {
        const link = document.createElement('a')
        link.href = '/KhaingWutYiWinResume.pdf'
        link.download = 'KhaingWutYiWinResume.pdf'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        onClose()
    }

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="absolute bottom-full left-0 mb-1 w-64 overflow-hidden shadow-[4px_4px_12px_rgba(0,0,0,0.4)] z-[9999]"
            style={{
                border: '2px solid #8a8070',
                borderTopColor: '#e0d8c8',
                borderLeftColor: '#e0d8c8',
                borderRadius: '4px',
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
        >
            {/* Top: user info — sidebar stripe */}
            <div className="flex">
                <div className="w-8 bg-gradient-to-b from-[#4a3aad] to-[#2b2b3d] flex items-end justify-center pb-2 flex-shrink-0">
                    <span className="text-[9px] font-black text-white/60 tracking-widest" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>KAYV OS</span>
                </div>
                <div className="flex-1 bg-[#c0b8a8]">
                    {/* User card */}
                    <div className="px-3 py-3 border-b border-[#a0a090] flex items-center gap-2">
                        <div className="w-8 h-8 rounded-sm border border-[#8a8070] overflow-hidden">
                            <img src="/myPf.png" alt="Kayv" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-[#2b2b3d]">Khaing Wut Yi Win</p>
                            <p className="text-[9px] text-[#5a5a5a] font-semibold">Frontend Developer</p>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="px-3 py-2 border-b border-[#a0a090]">
                        <form onSubmit={handleSearch} className="flex items-center gap-2 px-2 py-1" style={{
                            border: '2px solid #8a8070',
                            borderTopColor: '#6a6050',
                            borderLeftColor: '#6a6050',
                            borderBottomColor: '#d0c8b8',
                            borderRightColor: '#d0c8b8',
                            background: '#f0ebe3',
                        }}>
                            <Search size={12} className="text-[#5a5a7a] flex-shrink-0" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search..."
                                className="flex-1 bg-transparent outline-none text-[11px] text-[#2b2b3d] placeholder-[#8a8a8a]"
                            />
                        </form>
                    </div>

                    {/* App list */}
                    <div className="py-1">
                        {filtered.map((app) => (
                            <button
                                key={app.name}
                                onClick={() => openApp(app.name)}
                                className="flex items-center gap-2 w-full px-3 py-1.5 hover:bg-[#4a3aad] hover:text-white text-[#2b2b3d] transition-colors cursor-pointer text-left group"
                            >
                                <img src={app.icon} alt={app.label} className="w-5 h-5 filter brightness-0 opacity-60 group-hover:brightness-0 group-hover:invert group-hover:opacity-100" />
                                <span className="text-[11px] font-semibold">{app.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Divider */}
                    <div className="mx-3 border-t border-[#a0a090]" />

                    {/* Quick actions */}
                    <div className="py-1">
                        <button
                            onClick={handleResume}
                            className="flex items-center gap-2 w-full px-3 py-1.5 hover:bg-[#4a3aad] hover:text-white text-[#2b2b3d] transition-colors cursor-pointer group"
                        >
                            <Download size={14} className="opacity-60 group-hover:opacity-100 group-hover:text-white" />
                            <span className="text-[11px] font-semibold">Download Resume</span>
                        </button>
                        <button
                            onClick={handleHire}
                            className="flex items-center gap-2 w-full px-3 py-1.5 hover:bg-[#4a3aad] hover:text-white text-[#2b2b3d] transition-colors cursor-pointer group"
                        >
                            <Mail size={14} className="opacity-60 group-hover:opacity-100 group-hover:text-white" />
                            <span className="text-[11px] font-semibold">Hire Me</span>
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
