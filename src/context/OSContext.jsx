import { createContext, useContext, useEffect, useState } from 'react'

/**
 * Global OS state: which windows are open / minimized and the active
 * wallpaper + chrome theme (both persisted to localStorage).
 *
 * Consume it via the `useOS()` hook rather than importing the raw context.
 */
const OSContext = createContext(null)

const STORAGE_KEYS = {
  wallpaper: 'kayv-wallpaper',
  theme: 'kayv-theme',
}

export const OSProvider = ({ children }) => {
  const [openWindows, setOpenWindows] = useState([])
  const [minimizedWindows, setMinimizedWindows] = useState([])
  const [wallpaper, setWallpaperState] = useState(
    () => localStorage.getItem(STORAGE_KEYS.wallpaper) || 'default',
  )
  const [theme, setThemeState] = useState(
    () => localStorage.getItem(STORAGE_KEYS.theme) || 'classic',
  )

  // Reflect the chrome theme on <html> so global CSS can react to it.
  useEffect(() => {
    if (theme === 'glass') {
      document.documentElement.setAttribute('data-theme', 'glass')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [theme])

  const openWindow = (id) => {
    setOpenWindows((prev) => (prev.includes(id) ? prev : [...prev, id]))
    setMinimizedWindows((prev) => prev.filter((n) => n !== id))
  }

  const closeWindow = (id) => {
    setOpenWindows((prev) => prev.filter((n) => n !== id))
    setMinimizedWindows((prev) => prev.filter((n) => n !== id))
  }

  const minimizeWindow = (id) => {
    setMinimizedWindows((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }

  const restoreWindow = (id) => {
    setMinimizedWindows((prev) => prev.filter((n) => n !== id))
  }

  const setWallpaper = (key) => {
    setWallpaperState(key)
    localStorage.setItem(STORAGE_KEYS.wallpaper, key)
  }

  const setTheme = (key) => {
    setThemeState(key)
    localStorage.setItem(STORAGE_KEYS.theme, key)
  }

  const value = {
    openWindows,
    minimizedWindows,
    openWindow,
    closeWindow,
    minimizeWindow,
    restoreWindow,
    wallpaper,
    setWallpaper,
    theme,
    setTheme,
  }

  return <OSContext.Provider value={value}>{children}</OSContext.Provider>
}

/** Access OS window/theme state. Must be used within an `<OSProvider>`. */
export const useOS = () => {
  const ctx = useContext(OSContext)
  if (!ctx) throw new Error('useOS must be used within an OSProvider')
  return ctx
}
