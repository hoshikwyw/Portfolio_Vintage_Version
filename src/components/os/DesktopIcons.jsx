import { motion } from 'framer-motion'
import { useOS } from '@/context/OSContext'
import { apps } from '@/config/apps'
import LockIcon from '@/shared/components/ui/LockIcon'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.4 } },
}

const iconVariants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } },
}

export default function DesktopIcons({ onFocus }) {
  const { openWindow } = useOS()

  const handleClick = (id) => {
    openWindow(id)
    onFocus(id)
  }

  return (
    <motion.div
      className="absolute top-5 left-5 z-10 grid grid-cols-2 sm:grid-cols-1 gap-1"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {apps.map((app) => (
        <motion.button
          key={app.id}
          className="desktop-icon"
          variants={iconVariants}
          onClick={() => handleClick(app.id)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
        >
          {app.locked ? <LockIcon size={36} variant="desktop" /> : <img src={app.icon} alt={app.label} draggable={false} />}
          <span>{app.label}</span>
        </motion.button>
      ))}
    </motion.div>
  )
}
