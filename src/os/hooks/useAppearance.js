import { useCallback, useEffect, useMemo, useState } from 'react'
import { DEFAULT_THEME, DEFAULT_WALLPAPER } from '@/shared/config/theme'

const STORAGE_KEYS = {
  wallpaper: 'kayv-wallpaper',
  theme: 'kayv-theme',
}

const readStored = (key, fallback) => {
  try {
    return localStorage.getItem(key) || fallback
  } catch {
    // Private-mode / blocked storage — fall back to the default silently.
    return fallback
  }
}

const writeStored = (key, value) => {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Persisting the preference is best-effort; the session still works.
  }
}

/**
 * The user's chrome theme and wallpaper, persisted to localStorage.
 *
 * Split out of the window manager because the two share nothing: appearance is
 * a persisted preference, windows are ephemeral session state.
 */
export const useAppearance = () => {
  const [wallpaper, setWallpaperState] = useState(() =>
    readStored(STORAGE_KEYS.wallpaper, DEFAULT_WALLPAPER),
  )
  const [theme, setThemeState] = useState(() =>
    readStored(STORAGE_KEYS.theme, DEFAULT_THEME),
  )

  // Reflect the chrome theme on <html> so global CSS can react to it.
  useEffect(() => {
    if (theme === DEFAULT_THEME) {
      document.documentElement.removeAttribute('data-theme')
    } else {
      document.documentElement.setAttribute('data-theme', theme)
    }
  }, [theme])

  const setWallpaper = useCallback((key) => {
    setWallpaperState(key)
    writeStored(STORAGE_KEYS.wallpaper, key)
  }, [])

  const setTheme = useCallback((key) => {
    setThemeState(key)
    writeStored(STORAGE_KEYS.theme, key)
  }, [])

  return useMemo(
    () => ({ wallpaper, setWallpaper, theme, setTheme }),
    [wallpaper, setWallpaper, theme, setTheme],
  )
}
