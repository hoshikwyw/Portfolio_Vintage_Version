/**
 * Literal retro palette, duplicated from the CSS custom properties in
 * `src/index.css` on purpose.
 *
 * Surfaces that must render *without* the OS shell — the crash screen and the
 * full-page 404 — cannot rely on `var(--os-*)`, because the stylesheet may not
 * have loaded (or the theme attribute may not be set) at the moment they show.
 * Everything else in the app should use the CSS variables instead of this.
 */
export const RETRO_PALETTE = {
  desktop: '#1a1a2a',
  panel: '#c0b8a8',
  borderDark: '#8a8070',
  borderLight: '#e0d8c8',
  titlebar: 'linear-gradient(180deg, #4a4a6a, #2b2b3d)',
  titleText: '#e0d8c8',
  text: '#2b2b3d',
  button: 'linear-gradient(180deg, #d0c8b8, #b0a898)',
  buttonBorder: '#7a7060',
  danger: '#8a2020',
}

/** Beveled panel border shared by the standalone dialogs. */
export const beveledPanel = {
  background: RETRO_PALETTE.panel,
  border: `2px solid ${RETRO_PALETTE.borderDark}`,
  borderTopColor: RETRO_PALETTE.borderLight,
  borderLeftColor: RETRO_PALETTE.borderLight,
  borderRadius: '4px',
  boxShadow: '3px 3px 12px rgba(0,0,0,0.4)',
}

/** Beveled push-button used by the standalone dialogs. */
export const beveledButton = {
  color: RETRO_PALETTE.text,
  background: RETRO_PALETTE.button,
  border: `2px solid ${RETRO_PALETTE.buttonBorder}`,
  borderTopColor: RETRO_PALETTE.borderLight,
  borderLeftColor: RETRO_PALETTE.borderLight,
  borderRadius: '3px',
}
