import { createContext } from 'react'

/**
 * The OS context, split three ways so a change in one slice does not re-render
 * consumers of another.
 *
 * This was a single context whose value object changed identity on every window
 * open, close and focus. That re-rendered `Desktop` — and with it the whole
 * shell tree beneath it — including the four components that read nothing but
 * `openWindow`, a callback that never changes.
 *
 * - `OSActionsContext` holds the callbacks. Every one is `useCallback`-stable,
 *   so this value is built once and consumers of it alone never re-render.
 * - `OSWindowsContext` holds which windows exist, which are minimized and
 *   which has focus.
 * - `OSAppearanceContext` holds the wallpaper and theme.
 *
 * These modules exist separately from the provider and hooks only so the three
 * can share the same objects without a circular import.
 */
export const OSActionsContext = createContext(null)
export const OSWindowsContext = createContext(null)
export const OSAppearanceContext = createContext(null)
