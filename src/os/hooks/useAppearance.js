import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import {
  BASE_THEME,
  DEFAULT_THEME,
  DEFAULT_WALLPAPER,
  STORAGE_KEYS,
  resolveTheme,
} from '@/shared/config/theme'
import { readStorage, writeStorage } from '@/shared/lib/storage'

const LIGHT_QUERY = '(prefers-color-scheme: light)'

/*
 * The OS colour-scheme preference, read through `useSyncExternalStore` rather
 * than a state-plus-effect pair. The media query *is* the external store, so
 * this stays correct if the user flips their OS theme mid-session, with no
 * extra render on mount.
 */
const subscribePrefersLight = (onChange) => {
  const query = window.matchMedia(LIGHT_QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

const getPrefersLight = () => window.matchMedia(LIGHT_QUERY).matches

/** No DOM during SSR/prerender; assume dark, matching `BASE_THEME`. */
const getPrefersLightServer = () => false

/**
 * The user's chrome theme and wallpaper, persisted to localStorage.
 *
 * Split out of the window manager because the two share nothing: appearance is
 * a persisted preference, windows are ephemeral session state.
 *
 * `theme` is the stored *preference* (may be `system`); `resolvedTheme` is what
 * actually renders. Settings shows the former so "System" reads as selected,
 * while anything that needs real colours reads the latter.
 */
export const useAppearance = () => {
  const [wallpaper, setWallpaperState] = useState(() =>
    readStorage(STORAGE_KEYS.wallpaper) || DEFAULT_WALLPAPER,
  )
  const [theme, setThemeState] = useState(() =>
    readStorage(STORAGE_KEYS.theme) || DEFAULT_THEME,
  )

  const prefersLight = useSyncExternalStore(
    subscribePrefersLight,
    getPrefersLight,
    getPrefersLightServer,
  )

  const resolvedTheme = resolveTheme(theme, prefersLight)

  /*
   * Reflect the resolved theme on <html> so global CSS can react to it.
   *
   * The inline boot script in `index.html` has already stamped this attribute
   * before first paint; this effect only keeps it in sync when the preference
   * or the OS setting changes afterwards.
   */
  useEffect(() => {
    const root = document.documentElement
    if (resolvedTheme === BASE_THEME) {
      root.removeAttribute('data-theme')
    } else {
      root.setAttribute('data-theme', resolvedTheme)
    }
  }, [resolvedTheme])

  const setWallpaper = useCallback((key) => {
    setWallpaperState(key)
    writeStorage(STORAGE_KEYS.wallpaper, key)
  }, [])

  const setTheme = useCallback((key) => {
    setThemeState(key)
    writeStorage(STORAGE_KEYS.theme, key)
  }, [])

  return useMemo(
    () => ({ wallpaper, setWallpaper, theme, resolvedTheme, setTheme }),
    [wallpaper, setWallpaper, theme, resolvedTheme, setTheme],
  )
}
