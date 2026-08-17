/**
 * The dynamic import for each window, separate from the registry component.
 *
 * Kept in its own module for two reasons: a non-component export from a `.jsx`
 * file breaks Fast Refresh, and the preload hint below is imported by the
 * taskbar, start menu and desktop icons — none of which should have to pull in
 * the registry component to reach it.
 */

/** Marks that we have already reloaded once, so a real failure cannot loop. */
const RELOAD_FLAG = 'kayv-chunk-reload'

const readFlag = () => {
  try {
    return sessionStorage.getItem(RELOAD_FLAG)
  } catch {
    // Blocked storage — treat as "already tried" so we never loop.
    return '1'
  }
}

const writeFlag = (value) => {
  try {
    if (value === null) sessionStorage.removeItem(RELOAD_FLAG)
    else sessionStorage.setItem(RELOAD_FLAG, value)
  } catch {
    // Best effort; the guard above fails closed.
  }
}

/**
 * Load a window chunk, recovering from the stale-deploy case.
 *
 * Every chunk filename carries a content hash, so a deploy replaces all of
 * them. A tab that loaded the *previous* `index.html` still asks for the old
 * filenames, which no longer exist — the import rejects and the window would
 * otherwise fall into its error boundary with "Failed to fetch dynamically
 * imported module".
 *
 * Reloading fixes it, because that fetches the current `index.html` and with
 * it the current hashes. The session flag means a genuine failure (offline, a
 * real 404) surfaces as an error the second time instead of reloading forever.
 */
const importWindow = (load) =>
  load()
    .then((mod) => {
      // Getting here means chunks are resolving again; re-arm the recovery.
      writeFlag(null)
      return mod
    })
    .catch((error) => {
      if (readFlag()) throw error

      writeFlag('1')
      window.location.reload()

      // Never settles — the reload takes over before React can render.
      return new Promise(() => {})
    })

/** The bare dynamic imports, with no recovery attached. */
const rawImports = {
  Home: () => import('@/features/about'),
  Projects: () => import('@/features/projects'),
  Gallery: () => import('@/features/gallery'),
  'Send-Message': () => import('@/features/terminal'),
  Settings: () => import('@/features/settings'),
  Minesweeper: () => import('@/features/minesweeper'),
  Dashboard: () => import('@/features/admin'),
}

/** What `lazy()` uses: the same imports, wrapped in stale-deploy recovery. */
export const windowImports = Object.fromEntries(
  Object.entries(rawImports).map(([id, load]) => [id, () => importWindow(load)]),
)

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
 *
 * The rejection is swallowed rather than recovered from: a *hover* must never
 * reload the page out from under someone. If the chunk really is missing, the
 * click that follows goes through `importWindow`, which handles it there.
 */
export const preloadWindow = (id) => {
  rawImports[id]?.().catch(() => {})
}
