import { useState, useContext, lazy, Suspense } from 'react'
import MenuBar from './components/layout/MenuBar'
import WindowFrame from './components/layout/WindowFrame'
import DesktopIcons from './components/layout/DesktopIcons'
import StickyNote from './components/layout/StickyNote'
import DesktopContextMenu from './components/layout/DesktopContextMenu'
import WelcomeDialog from './components/layout/WelcomeDialog'
import { MenuContext, MenuProvider } from './context/MenuContext'
import BootSplash from './components/layout/BootSplash'
import { SpeedInsights } from '@vercel/speed-insights/react';

const Desktop = ({ focusedWindow, onFocus }) => {
  const { wallpaper, openWindow } = useContext(MenuContext)
  const wallpaperClass = wallpaper !== 'default' ? `wallpaper-${wallpaper}` : ''

  const handleOpenWindow = (name) => {
    openWindow(name)
    onFocus(name)
  }

  return (
    <div className={`mainBackground ${wallpaperClass}`}>
      <div className="gradient-orb gradient-orb-1" />
      <div className="gradient-orb gradient-orb-2" />
      <div className="gradient-orb gradient-orb-3" />

      <DesktopIcons onFocus={onFocus} />
      <StickyNote />
      <WindowFrame focusedWindow={focusedWindow} onFocus={onFocus} />
      <MenuBar onMenuClick={onFocus} />

      <DesktopContextMenu onOpenWindow={handleOpenWindow} />
      <WelcomeDialog onOpenWindow={handleOpenWindow} />
    </div>
  )
}

const App = () => {
  const [focusedWindow, setFocusedWindow] = useState("Home")
  const [booted, setBooted] = useState(false)

  if (!booted) {
    return <BootSplash onFinish={() => setBooted(true)} />
  }

  return (
    <MenuProvider>
      <Desktop focusedWindow={focusedWindow} onFocus={(name) => setFocusedWindow(name)} />
      <SpeedInsights />
    </MenuProvider>
  )
}

export default App
