import { useContext } from 'react'
import { motion } from 'framer-motion'
import { MenuContext } from '../../context/MenuContext'

const shortcuts = [
    { name: 'Home', icon: 'icons/home.svg', label: 'About Me' },
    { name: 'Projects', icon: 'icons/openFolder.svg', label: 'Projects' },
    { name: 'Gallery', icon: 'icons/gallery.svg', label: 'Gallery' },
    { name: 'Send-Message', icon: 'icons/terminal.svg', label: 'Terminal' },
    { name: 'Settings', icon: 'icons/settings.svg', label: 'Settings' },
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
                    <img src={s.icon} alt={s.label} draggable={false} />
                    <span>{s.label}</span>
                </motion.button>
            ))}
        </motion.div>
    )
}
