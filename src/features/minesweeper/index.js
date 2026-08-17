/*
 * Feature barrel. Exports only the window component, as the default — the
 * window registry lazy-imports this, so anything else exported here would be
 * pulled into the chunk whether it is used or not.
 */
export { default } from './Minesweeper'
