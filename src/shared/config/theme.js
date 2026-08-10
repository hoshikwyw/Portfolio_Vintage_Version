/**
 * Selectable appearance options for the OS.
 *
 * These are user-facing *choices* (persisted by key in Settings), not fixed
 * constants — hence `config/` rather than `constants/`. The actual colours for
 * each theme live in `src/index.css` behind `[data-theme]`.
 */

/** Desktop wallpaper gradients. `key` maps to a `.wallpaper-<key>` CSS class. */
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

/** Default selections used before the user has picked anything. */
export const DEFAULT_WALLPAPER = 'default'
export const DEFAULT_THEME = 'classic'
