import { useContext, useState } from 'react'
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
        transition: { staggerChildren: 0.06, delayChildren: 0.5 },
    },
}

const iconVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.8 },
    visible: {
        opacity: 1, y: 0, scale: 1,
        transition: { type: 'spring', stiffness: 300, damping: 20 },
    },
}

export default function DesktopIcons({ onFocus }) {
    const { openWindow } = useContext(MenuContext)
    const [selected, setSelected] = useState(null)

    const handleDoubleClick = (name) => {
        openWindow(name)
        onFocus(name)
    }

    const handleClick = (name) => {
        setSelected(name)
    }

    // Deselect when clicking desktop background
    const handleDesktopClick = (e) => {
        if (e.target === e.currentTarget) {
            setSelected(null)
        }
    }

    return (
        <motion.div
            className="absolute top-6 left-6 z-10 flex flex-col gap-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onClick={handleDesktopClick}
        >
            {shortcuts.map((shortcut) => (
                <motion.div
                    key={shortcut.name}
                    className={`desktop-icon ${selected === shortcut.name ? 'selected' : ''}`}
                    variants={iconVariants}
                    onClick={() => handleClick(shortcut.name)}
                    onDoubleClick={() => handleDoubleClick(shortcut.name)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <img src={shortcut.icon} alt={shortcut.label} draggable={false} />
                    <span>{shortcut.label}</span>
                </motion.div>
            ))}
        </motion.div>
    )
}
