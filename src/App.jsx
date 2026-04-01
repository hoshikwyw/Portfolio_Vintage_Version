import { useState, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MenuBar from './components/layout/MenuBar'
import WindowFrame from './components/layout/WindowFrame'
import DesktopIcons from './components/layout/DesktopIcons'
import { MenuContext, MenuProvider } from './context/MenuContext'
import BootSplash from './components/layout/BootSplash'
import { SpeedInsights } from '@vercel/speed-insights/react';

const Desktop = ({ focusedWindow, onFocus }) => {
  const { wallpaper } = useContext(MenuContext)
  const wallpaperClass = wallpaper !== 'default' ? `wallpaper-${wallpaper}` : ''

  return (
    <div className={`mainBackground ${wallpaperClass} relative flex h-screen w-screen justify-center items-center overflow-hidden`}>
      {/* Animated gradient orbs */}
      <div className="gradient-orb gradient-orb-1" />
      <div className="gradient-orb gradient-orb-2" />
      <div className="gradient-orb gradient-orb-3" />

      {/* Desktop shortcut icons */}
      <DesktopIcons onFocus={onFocus} />

      {/* Windows */}
      <div>
        <WindowFrame focusedWindow={focusedWindow} onFocus={onFocus} />
      </div>

      {/* Taskbar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
      >
        <MenuBar onMenuClick={onFocus} />
      </motion.div>
    </div>
  )
}

const App = () => {
  const [focusedWindow, setFocusedWindow] = useState("Home")
  const [booted, setBooted] = useState(false)

  const handleFocus = (menuName) => {
    setFocusedWindow(menuName)
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {!booted && (
          <motion.div
            key="boot"
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            <BootSplash onFinish={() => setBooted(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {booted && (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            <MenuProvider>
              <Desktop focusedWindow={focusedWindow} onFocus={handleFocus} />
              <SpeedInsights />
            </MenuProvider>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default App
