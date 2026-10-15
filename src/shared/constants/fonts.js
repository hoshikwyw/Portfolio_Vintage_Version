/** Font stacks used across the retro-OS chrome. */

/**
 * The system font stack used across every window and chrome surface.
 *
 * The page sets this on `html` (styles/base.css), so components inherit it and
 * should not repeat it. Only the crash and 404 screens apply it inline, since
 * they may render before the stylesheet has loaded.
 */
export const FONT_STACK = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"

/** Monospace stack for terminal / boot surfaces. */
export const MONO_STACK = "'Consolas', 'Courier New', monospace"
