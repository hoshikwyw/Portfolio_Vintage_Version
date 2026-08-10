import { useCallback, useMemo, useState } from 'react'

const without = (list, id) => list.filter((item) => item !== id)
const withUnique = (list, id) => (list.includes(id) ? list : [...list, id])

/**
 * Which windows exist, which are minimized, and which one has focus.
 *
 * Focus lives here rather than in the route component so the taskbar, desktop
 * icons and window layer can each read and set it directly, instead of having
 * `focusedWindow` / `onFocus` threaded through every shell component.
 *
 * @param {string} [initialWindowId] Opened and focused on mount (deep links).
 */
export const useWindowManager = (initialWindowId) => {
  const [openWindows, setOpenWindows] = useState(() =>
    initialWindowId ? [initialWindowId] : [],
  )
  const [minimizedWindows, setMinimizedWindows] = useState([])
  const [focusedWindow, setFocusedWindow] = useState(initialWindowId ?? null)

  const focusWindow = useCallback((id) => setFocusedWindow(id), [])

  /** Open (or re-focus) a window, un-minimizing it if it was hidden. */
  const openWindow = useCallback((id) => {
    setOpenWindows((prev) => withUnique(prev, id))
    setMinimizedWindows((prev) => without(prev, id))
    setFocusedWindow(id)
  }, [])

  const closeWindow = useCallback((id) => {
    setOpenWindows((prev) => without(prev, id))
    setMinimizedWindows((prev) => without(prev, id))
    // Hand focus to whatever is left, so the next window is interactive.
    setFocusedWindow((current) => (current === id ? null : current))
  }, [])

  const minimizeWindow = useCallback((id) => {
    setMinimizedWindows((prev) => withUnique(prev, id))
    setFocusedWindow((current) => (current === id ? null : current))
  }, [])

  const restoreWindow = useCallback((id) => {
    setMinimizedWindows((prev) => without(prev, id))
    setFocusedWindow(id)
  }, [])

  /** Taskbar behaviour: restore if hidden, otherwise just bring to front. */
  const activateWindow = useCallback(
    (id) => {
      setMinimizedWindows((prev) => without(prev, id))
      setFocusedWindow(id)
    },
    [],
  )

  /** Open windows that are not currently minimized, in open order. */
  const visibleWindows = useMemo(
    () => openWindows.filter((id) => !minimizedWindows.includes(id)),
    [openWindows, minimizedWindows],
  )

  return useMemo(
    () => ({
      openWindows,
      minimizedWindows,
      visibleWindows,
      focusedWindow,
      openWindow,
      closeWindow,
      minimizeWindow,
      restoreWindow,
      activateWindow,
      focusWindow,
    }),
    [
      openWindows, minimizedWindows, visibleWindows, focusedWindow,
      openWindow, closeWindow, minimizeWindow, restoreWindow, activateWindow, focusWindow,
    ],
  )
}
