/**
 * The dynamic import for each window, separate from the registry component.
 *
 * Kept in its own module for two reasons: a non-component export from a `.jsx`
 * file breaks Fast Refresh, and the preload hint below is imported by the
 * taskbar, start menu and desktop icons — none of which should have to pull in
 * the registry component to reach it.
 */
export const windowImports = {
  Home: () => import('@/features/about'),
  Projects: () => import('@/features/projects'),
  Gallery: () => import('@/features/gallery'),
  'Send-Message': () => import('@/features/terminal'),
  Settings: () => import('@/features/settings'),
  Dashboard: () => import('@/features/admin'),
}

/**
 * Start fetching a window's chunk before it is opened.
 *
 * Opening a window used to begin its network fetch, module parse and feature
 * mount at the exact moment the open animation started — all on the main
 * thread, so the animation dropped frames and felt rough. Calling this on
 * hover or focus gives the browser that head start, and by the time the click
 * lands the module is usually already evaluated.
 *
 * Safe to call repeatedly: a dynamic import resolves from the module cache
 * after the first call, so extra calls cost nothing and never re-request.
 */
export const preloadWindow = (id) => {
  // A failure here is irrelevant — this is only a hint. Suspense will retry
  // the same import when the window is actually opened.
  windowImports[id]?.().catch(() => {})
}
