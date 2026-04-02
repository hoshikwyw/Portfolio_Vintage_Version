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
            className="absolute bottom-full left-0 mb-2 w-72 rounded-2xl overflow-hidden border-[1.5px] border-black/15 shadow-[0_20px_60px_rgba(0,0,0,0.3)] z-[9999]"
            style={{ backdropFilter: 'blur(24px)' }}
        >
            {/* Top: user info */}
            <div className="bg-gradient-to-br from-[#2d1b4e] to-[#6b5b95] px-5 pt-5 pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border-2 border-[#d4af37]/50 overflow-hidden">
                        <img src="/myPf.png" alt="Kayv" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <p className="text-white font-bold text-sm">Khaing Wut Yi Win</p>
                        <p className="text-white/60 text-[10px] font-semibold uppercase tracking-wider">Frontend Developer</p>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="bg-[#faf9f6] px-4 py-3 border-b border-black/10">
                <form onSubmit={handleSearch} className="flex items-center gap-2 bg-white rounded-xl border border-black/10 px-3 py-2">
                    <Search size={14} className="text-[#6b5b95] flex-shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search apps or web..."
                        className="flex-1 bg-transparent outline-none text-xs text-[#2d1b4e] placeholder-black/30 font-sans"
                    />
                </form>
            </div>

            {/* App grid */}
            <div className="bg-[#faf9f6] px-4 py-3">
                <p className="text-[9px] text-[#6b5b95] font-bold uppercase tracking-widest mb-2">Applications</p>
                <div className="grid grid-cols-3 gap-1">
                    {filtered.map((app) => (
                        <button
                            key={app.name}
                            onClick={() => openApp(app.name)}
                            className="flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl hover:bg-[#d4af37]/10 transition-colors cursor-pointer"
                        >
                            <img src={app.icon} alt={app.label} className="w-7 h-7 filter brightness-0 opacity-70" />
                            <span className="text-[10px] text-[#2d1b4e] font-semibold">{app.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Quick actions */}
            <div className="bg-[#f5f3ef] px-4 py-3 border-t border-black/10 flex gap-2">
                <button
                    onClick={handleResume}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#b8941f] text-[#2d1b4e] text-[10px] font-bold uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-transform border border-[#d4af37]/50"
                >
                    <Download size={12} />
                    Resume
                </button>
                <button
                    onClick={handleHire}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gradient-to-br from-[#2d1b4e] to-[#6b5b95] text-white text-[10px] font-bold uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-transform border border-[#d4af37]/30"
                >
                    <Mail size={12} className="text-[#d4af37]" />
                    Hire Me
                </button>
            </div>
        </motion.div>
    )
}
