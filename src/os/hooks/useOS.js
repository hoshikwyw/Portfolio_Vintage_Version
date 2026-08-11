import { useContext } from 'react'
import { OSActionsContext, OSAppearanceContext, OSWindowsContext } from '@/os/context/osContext'

/*
 * Three narrow readers rather than one `useOS()`.
 *
 * A component re-renders when a context it subscribes to changes, so reading
 * the whole OS state to call a single callback made every window open, close
 * and focus re-render the entire shell. Take the narrowest hook that covers
 * what the component uses; reach for two if it genuinely needs two.
 */

/**
 * The OS action callbacks — opening, closing, focusing windows and setting
 * appearance. This context never changes, so components that use only these
 * never re-render because of OS state.
 *
 * @throws if used outside an `<OSProvider>`.
 */
export const useOSActions = () => {
  const ctx = useContext(OSActionsContext)
  if (!ctx) throw new Error('useOSActions must be used within an OSProvider')
  return ctx
}

/**
 * Which windows are open, minimized, visible and focused.
 *
 * @throws if used outside an `<OSProvider>`.
 */
export const useOSWindows = () => {
  const ctx = useContext(OSWindowsContext)
  if (!ctx) throw new Error('useOSWindows must be used within an OSProvider')
  return ctx
}

/**
 * The active wallpaper and chrome theme. `theme` is the stored preference and
 * may be `system`; `resolvedTheme` is what actually renders.
 *
 * @throws if used outside an `<OSProvider>`.
 */
export const useOSAppearance = () => {
  const ctx = useContext(OSAppearanceContext)
  if (!ctx) throw new Error('useOSAppearance must be used within an OSProvider')
  return ctx
}
