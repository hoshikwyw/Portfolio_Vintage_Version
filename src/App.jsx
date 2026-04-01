import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MenuBar from './components/layout/MenuBar'
import WindowFrame from './components/layout/WindowFrame'
import { MenuProvider } from './context/MenuContext'
import BootSplash from './components/layout/BootSplash'
import { SpeedInsights } from '@vercel/speed-insights/react';
import WeatherWidget from './components/widgets/WeatherWidget'
import ClockWidget from './components/widgets/ClockWidget'

const App = () => {
  const [focusedWindow, setFocusedWindow] = useState("Home");
  const [booted, setBooted] = useState(false);

  const handleFocus = (menuName) => {
    setFocusedWindow(menuName);
  };

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
              <div className='mainBackground relative flex h-screen w-screen justify-center items-center overflow-hidden'>
                {/* Animated gradient orbs for depth */}
                <div className="gradient-orb gradient-orb-1" />
                <div className="gradient-orb gradient-orb-2" />
                <div className="gradient-orb gradient-orb-3" />

                <motion.div
                  className="absolute inset-0 w-[280px] h-[300px] top-5 left-5 rounded-md z-10"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                >
                  <WeatherWidget />
                </motion.div>

                <motion.div
                  className="absolute top-5 right-5 rounded-md z-10"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                >
                  <ClockWidget />
                </motion.div>

                <div>
                  <WindowFrame focusedWindow={focusedWindow} onFocus={handleFocus} />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
                >
                  <MenuBar onMenuClick={handleFocus} />
                </motion.div>
              </div>
              <SpeedInsights />
            </MenuProvider>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default App
