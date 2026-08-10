import { useMemo } from 'react'
import { useAppearance } from '@/os/hooks/useAppearance'
import { useWindowManager } from '@/os/hooks/useWindowManager'
import { OSContext } from './osContext'

/**
 * Supplies global OS state — open/minimized/focused windows plus the active
 * wallpaper and chrome theme.
 *
 * A thin composition of two independent hooks: the window manager owns session
 * state, appearance owns persisted preferences. Read it with `useOS()`.
 *
 * @param {string} [initialWindowId] Window opened and focused on mount, used by
 *   the `/window/:appId` deep link.
 */
export const OSProvider = ({ children, initialWindowId }) => {
  const windows = useWindowManager(initialWindowId)
  const appearance = useAppearance()

  // Both halves are memoized, so consumers only re-render when one changes.
  const value = useMemo(() => ({ ...windows, ...appearance }), [windows, appearance])

  return <OSContext.Provider value={value}>{children}</OSContext.Provider>
}

export default OSProvider
