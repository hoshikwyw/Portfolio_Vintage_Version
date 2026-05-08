import { useState, useContext, lazy, Suspense } from 'react'
import MenuBar from './components/layout/MenuBar'
import WindowFrame from './components/layout/WindowFrame'
import DesktopIcons from './components/layout/DesktopIcons'
import StickyNote from './components/layout/StickyNote'
import QuickActions from './components/layout/QuickActions'
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
      <QuickActions />
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
      {/* Visually hidden content for search engine crawlers */}
      <div aria-hidden="true" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>
        <h1>Khaing Wut Yi Win — Frontend Developer Portfolio</h1>
        <p>Hi! I'm Kayv — a creative frontend developer from Yangon, Myanmar who loves crafting smooth UIs with React and Tailwind. I'm always excited to learn something new.</p>
        <h2>Contact</h2>
        <p>Email: khaingwutyiwin1712@gmail.com</p>
        <p>Phone: +959795847089</p>
        <p>Location: Yangon, Myanmar</p>
        <h2>Skills</h2>
        <ul>
          <li>React.js — 90%</li>
          <li>Tailwind CSS — 85%</li>
          <li>Next.js — 75%</li>
          <li>JavaScript — 90%</li>
          <li>TypeScript — 70%</li>
        </ul>
        <h2>Experience</h2>
        <ul>
          <li>Junior Frontend Developer at IT-Wizard since November 2024</li>
          <li>Freelance Projects — Portfolio, Booking App, AI Assistant UI</li>
        </ul>
        <h2>Education</h2>
        <ul>
          <li>Frontend Web Developer — MMS-IT</li>
          <li>Self-taught Frontend Development: React, Tailwind CSS, Next.js, React Native, TypeScript</li>
        </ul>
        <h2>Interests</h2>
        <p>Design, Animation, AI, Vintage UI, 2D Games</p>
        <h2>Languages</h2>
        <p>English (Intermediate), Burmese (Native)</p>
      </div>
      <Desktop focusedWindow={focusedWindow} onFocus={(name) => setFocusedWindow(name)} />
      <SpeedInsights />
    </MenuProvider>
  )
}

export default App
