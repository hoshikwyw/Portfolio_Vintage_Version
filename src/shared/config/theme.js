/**
 * Selectable appearance options for the OS.
 *
 * These are user-facing *choices* (persisted by key in Settings), not fixed
 * constants — hence `config/` rather than `constants/`. The actual colours for
 * each theme live in `src/styles/index.css` behind `[data-theme]`.
 */

/**
 * localStorage keys for the persisted preferences.
 *
 * NOTE: the theme key is mirrored by the inline boot script in `index.html`,
 * which stamps `data-theme` before first paint so the page never flashes the
 * wrong theme. Change the two together.
 */
export const STORAGE_KEYS = {
  wallpaper: 'kayv-wallpaper',
  theme: 'kayv-theme',
}

/**
 * Desktop wallpaper gradients. `key` maps to a `.wallpaper-<key>` CSS class.
 *
 * Each wallpaper has a dark and a light rendition; the CSS class switches
 * between them by theme, and `gradientFor()` picks the matching swatch so the
 * Settings preview always shows what you will actually get.
 */
export const wallpapers = [
  {
    key: 'default',
    label: 'Classic',
    gradient: 'linear-gradient(180deg, #1e1e32, #2a2a3e, #3a3a52)',
    lightGradient: 'linear-gradient(180deg, #f2f4fb, #e4e8f4, #d2d8ea)',
  },
  {
    key: 'midnight',
    label: 'Midnight',
    gradient: 'linear-gradient(180deg, #08081a, #0e0e2a, #1a1a3e)',
    lightGradient: 'linear-gradient(180deg, #eef1fa, #dde3f5, #c8d1ec)',
  },
  {
    key: 'ocean',
    label: 'Ocean',
    gradient: 'linear-gradient(180deg, #081020, #0e1e35, #1a3050)',
    lightGradient: 'linear-gradient(180deg, #eaf4fa, #d5e8f4, #bcd9ec)',
  },
  {
    key: 'forest',
    label: 'Forest',
    gradient: 'linear-gradient(180deg, #081208, #0e1e0e, #1a301a)',
    lightGradient: 'linear-gradient(180deg, #edf6ec, #dcecda, #c4e0c1)',
  },
  {
    key: 'rose',
    label: 'Rose',
    gradient: 'linear-gradient(180deg, #18101a, #2a1a22, #3a2a32)',
    lightGradient: 'linear-gradient(180deg, #fbeef3, #f4dde7, #ecc9d8)',
  },
  {
    key: 'ember',
    label: 'Ember',
    gradient: 'linear-gradient(180deg, #140e05, #2a1a08, #3a2a10)',
    lightGradient: 'linear-gradient(180deg, #fdf3e6, #f8e6cd, #f2d6ae)',
  },
]

/** The pseudo-theme that defers to the operating system's colour scheme. */
export const SYSTEM_THEME = 'system'

/**
 * The theme rendered by bare `:root` — it needs no `data-theme` attribute, so
 * the boot script and `useAppearance` both *remove* the attribute for it.
 */
export const BASE_THEME = 'classic'

/** What `system` resolves to, per the OS `prefers-color-scheme` reading. */
export const SYSTEM_LIGHT_THEME = 'light'
export const SYSTEM_DARK_THEME = BASE_THEME

/**
 * Themes whose chrome is light — the desktop, icons and wallpapers all flip
 * to their light rendition. Kept as a set so adding a second light theme
 * later is a one-line change rather than a scattered `=== 'light'` hunt.
 */
const LIGHT_THEMES = new Set([SYSTEM_LIGHT_THEME])

/** Is this a light-chrome theme? Expects a *resolved* key, never `system`. */
export const isLightTheme = (theme) => LIGHT_THEMES.has(theme)

/**
 * Chrome themes, in the order Settings renders them.
 *
 * `preview`, `previewText` and `previewChrome` describe the Settings swatch:
 * the card's own background, the text colour that stays legible on it, and the
 * miniature window drawn inside. Keeping them here rather than in a lookup
 * inside `ThemePicker` means a new theme is one entry, edited in one place.
 */
export const themes = [
  {
    key: SYSTEM_THEME,
    label: 'System',
    desc: 'Follow your OS light/dark setting',
    preview: 'linear-gradient(135deg, #5b5e9e, #2b2b3d)',
    previewText: '#fff',
    // Split down the middle, standing for "either one, whichever you're using".
    previewChrome: {
      background: 'linear-gradient(90deg, #ecebe6 0 50%, #23233a 50% 100%)',
      border: '1px solid #6f6f80',
      titlebar: 'linear-gradient(90deg, #6a6dab 0 50%, #3a3a5a 50% 100%)',
      radius: 3,
    },
  },
  {
    key: 'classic',
    label: 'Classic Retro',
    desc: 'Win95 beveled borders, gray chrome',
    preview: 'linear-gradient(135deg, #c0b8a8, #a8a090)',
    previewText: '#2b2b3d',
    previewChrome: {
      background: '#c0b8a8',
      border: '1px solid #8a8070',
      titlebar: 'linear-gradient(180deg, #4a4a6a, #2b2b3d)',
      radius: 3,
    },
  },
  {
    key: 'glass',
    label: 'Glass',
    desc: 'iOS-style blur, translucent panels',
    preview: 'linear-gradient(135deg, #1a1a3a, #0a0a2e)',
    previewText: '#fff',
    previewChrome: {
      background: 'rgba(255,255,255,0.1)',
      border: '1px solid rgba(255,255,255,0.15)',
      titlebar: 'rgba(255,255,255,0.08)',
      radius: 6,
    },
  },
  {
    key: 'light',
    label: 'Light Retro',
    desc: 'Bright chrome, dark text, daylight desktop',
    preview: 'linear-gradient(135deg, #fbfaf7, #dcdad2)',
    previewText: '#21232e',
    previewChrome: {
      background: '#ffffff',
      border: '1px solid #a9a79e',
      titlebar: 'linear-gradient(180deg, #6a6dab, #4e5192)',
      radius: 3,
    },
  },
]

/** Look up a theme definition by key. */
export const getTheme = (key) => themes.find((theme) => theme.key === key)

/** Default selections used before the user has picked anything. */
export const DEFAULT_WALLPAPER = 'default'
export const DEFAULT_THEME = SYSTEM_THEME

/**
 * Collapse a stored preference into the theme actually rendered.
 *
 * @param {string} theme        The stored preference, possibly `system`.
 * @param {boolean} prefersLight Current `prefers-color-scheme: light` reading.
 */
export const resolveTheme = (theme, prefersLight) =>
  theme === SYSTEM_THEME
    ? (prefersLight ? SYSTEM_LIGHT_THEME : SYSTEM_DARK_THEME)
    : theme

/** The wallpaper swatch matching a resolved theme's light/dark rendition. */
export const gradientFor = (wallpaper, resolvedTheme) =>
  isLightTheme(resolvedTheme) ? wallpaper.lightGradient : wallpaper.gradient
