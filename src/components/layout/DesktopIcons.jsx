import { useContext } from 'react'
import { motion } from 'framer-motion'
import { MenuContext } from '../../context/MenuContext'

const LockSvg = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ filter: 'brightness(0) invert(1) drop-shadow(0 1px 2px rgba(0,0,0,0.4))', opacity: 0.85 }}>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
)

const shortcuts = [
    { name: 'Home', icon: 'icons/home.svg', label: 'About Me' },
    { name: 'Projects', icon: 'icons/openFolder.svg', label: 'Projects' },
    { name: 'Gallery', icon: 'icons/gallery.svg', label: 'Gallery' },
    { name: 'Send-Message', icon: 'icons/terminal.svg', label: 'Terminal' },
    { name: 'Settings', icon: 'icons/settings.svg', label: 'Settings' },
    { name: 'Dashboard', icon: null, label: 'Dashboard', customIcon: true },
]

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.07, delayChildren: 0.4 },
    },
}

const iconVariants = {
    hidden: { opacity: 0, scale: 0.6 },
    visible: {
        opacity: 1, scale: 1,
        transition: { type: 'spring', stiffness: 300, damping: 20 },
    },
}

export default function DesktopIcons({ onFocus }) {
    const { openWindow } = useContext(MenuContext)

    const handleClick = (name) => {
        openWindow(name)
        onFocus(name)
    }

    return (
        <motion.div
            className="absolute top-5 left-5 z-10 grid grid-cols-2 sm:grid-cols-1 gap-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {shortcuts.map((s) => (
                <motion.button
                    key={s.name}
                    className="desktop-icon"
                    variants={iconVariants}
                    onClick={() => handleClick(s.name)}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                >
                    {s.customIcon ? <LockSvg /> : <img src={s.icon} alt={s.label} draggable={false} />}
                    <span>{s.label}</span>
                </motion.button>
            ))}
        </motion.div>
    )
}
