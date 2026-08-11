/**
 * The Framer Motion feature bundle, isolated in its own module so it can be
 * code-split away from the shell.
 *
 * `LazyMotion` in `AppProviders` imports this dynamically, which lets Rollup
 * put the heavy half of framer-motion (`motion-dom`) in a chunk that loads
 * *after* first paint. The shell keeps only the lightweight `m` component and
 * `AnimatePresence`.
 *
 * `domMax` rather than `domAnimation` because `DraggableWindow` uses `drag` —
 * dragging is not part of the smaller bundle, and windows would silently stop
 * moving with `domAnimation`.
 */
export { domMax as default } from 'framer-motion'
