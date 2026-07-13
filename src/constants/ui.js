/** Shared UI constants for the retro-OS theme. */

/** The system font stack used across every window and chrome surface. */
export const FONT_STACK = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"

/** Monospace stack for terminal / boot surfaces. */
export const MONO_STACK = "'Consolas', 'Courier New', monospace"

/** Desktop wallpaper gradients (persisted by key in Settings). */
export const wallpapers = [
  { key: 'default', label: 'Classic', gradient: 'linear-gradient(180deg, #1e1e32, #2a2a3e, #3a3a52)' },
  { key: 'midnight', label: 'Midnight', gradient: 'linear-gradient(180deg, #08081a, #0e0e2a, #1a1a3e)' },
  { key: 'ocean', label: 'Ocean', gradient: 'linear-gradient(180deg, #081020, #0e1e35, #1a3050)' },
  { key: 'forest', label: 'Forest', gradient: 'linear-gradient(180deg, #081208, #0e1e0e, #1a301a)' },
  { key: 'rose', label: 'Rose', gradient: 'linear-gradient(180deg, #18101a, #2a1a22, #3a2a32)' },
  { key: 'ember', label: 'Ember', gradient: 'linear-gradient(180deg, #140e05, #2a1a08, #3a2a10)' },
]

/** Chrome themes (Win95-style vs. frosted glass). */
export const themes = [
  { key: 'classic', label: 'Classic Retro', desc: 'Win95 beveled borders, gray chrome', preview: 'linear-gradient(135deg, #c0b8a8, #a8a090)' },
  { key: 'glass', label: 'Glass', desc: 'iOS-style blur, translucent panels', preview: 'linear-gradient(135deg, #1a1a3a, #0a0a2e)' },
]
