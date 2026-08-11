import { useMemo } from 'react'
import { useAppearance } from '@/os/hooks/useAppearance'
import { useWindowManager } from '@/os/hooks/useWindowManager'
import { OSActionsContext, OSAppearanceContext, OSWindowsContext } from './osContext'

/**
 * Supplies global OS state — open/minimized/focused windows plus the active
 * wallpaper and chrome theme.
 *
 * A thin composition of two independent hooks: the window manager owns session
 * state, appearance owns persisted preferences. Their combined output is then
 * published as three separate contexts (see `osContext`) so that, for example,
 * focusing a window does not re-render the desktop icons.
 *
 * Read it with `useOSActions()`, `useOSWindows()` or `useOSAppearance()` —
 * take the narrowest one that covers what the component actually uses.
 *
 * @param {string} [initialWindowId] Window opened and focused on mount, used by
 *   the `/window/:appId` deep link.
 */
export const OSProvider = ({ children, initialWindowId }) => {
  const {
    openWindows, minimizedWindows, visibleWindows, focusedWindow,
    openWindow, closeWindow, minimizeWindow, restoreWindow, activateWindow, focusWindow,
  } = useWindowManager(initialWindowId)

  const { wallpaper, theme, resolvedTheme, setWallpaper, setTheme } = useAppearance()

  // Every dependency here is a stable `useCallback`, so this object is created
  // once for the lifetime of the provider and never invalidates its consumers.
  const actions = useMemo(
    () => ({
      openWindow, closeWindow, minimizeWindow, restoreWindow, activateWindow, focusWindow,
      setWallpaper, setTheme,
    }),
    [
      openWindow, closeWindow, minimizeWindow, restoreWindow, activateWindow, focusWindow,
      setWallpaper, setTheme,
    ],
  )

  const windows = useMemo(
    () => ({ openWindows, minimizedWindows, visibleWindows, focusedWindow }),
    [openWindows, minimizedWindows, visibleWindows, focusedWindow],
  )

  const appearance = useMemo(
    () => ({ wallpaper, theme, resolvedTheme }),
    [wallpaper, theme, resolvedTheme],
  )

  return (
    <OSActionsContext.Provider value={actions}>
      <OSWindowsContext.Provider value={windows}>
        <OSAppearanceContext.Provider value={appearance}>
          {children}
        </OSAppearanceContext.Provider>
      </OSWindowsContext.Provider>
    </OSActionsContext.Provider>
  )
}

export default OSProvider
