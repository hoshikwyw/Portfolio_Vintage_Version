/**
 * Window entry point.
 *
 * Feature barrels export only the window component, as the default, because
 * they are the target of `lazy(() => import(...))` in the OS window registry.
 * Anything else a feature shares (hooks, query keys) is imported by its own
 * path, so consuming it never drags the whole window into the caller's chunk.
 */
export { default } from './About'
