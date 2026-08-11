/**
 * Palette for the surfaces that must render *without* the OS shell — the crash
 * screen and the full-page 404.
 *
 * Each entry is a CSS variable with the classic-theme literal as its fallback.
 * That keeps the original guarantee (if the crash happened before the theme
 * stylesheet applied, these still paint a correct retro dialog rather than
 * leaving unstyled text on a white page) while letting the dialogs follow the
 * user's theme in the normal case, where the stylesheet *is* loaded.
 *
 * `var()` takes everything after the first comma as the fallback, so the
 * gradients below are passed through intact.
 */
export const RETRO_PALETTE = {
  desktop: 'var(--os-bg, #1a1a2a)',
  panel: 'var(--os-window, #c0b8a8)',
  borderDark: 'var(--os-border-dark, #8a8070)',
  borderLight: 'var(--os-border-light, #e0d8c8)',
  titlebar: 'var(--os-titlebar, linear-gradient(180deg, #4a4a6a, #2b2b3d))',
  titleText: 'var(--os-titlebar-text, #e0d8c8)',
  text: 'var(--os-text, #2b2b3d)',
  button: 'var(--os-btn-bg, linear-gradient(180deg, #d0c8b8, #b0a898))',
  buttonBorder: 'var(--os-btn-border-bottom, #7a7060)',
  danger: 'var(--os-danger, #8a2020)',
  field: 'var(--os-input-bg, #f0ebe3)',
  fieldBorder: 'var(--os-input-border, 2px inset #a0a090)',
  muted: 'var(--os-text-secondary, #4a4a6a)',
}

/** Beveled panel border shared by the standalone dialogs. */
export const beveledPanel = {
  background: RETRO_PALETTE.panel,
  border: `2px solid ${RETRO_PALETTE.borderDark}`,
  borderTopColor: RETRO_PALETTE.borderLight,
  borderLeftColor: RETRO_PALETTE.borderLight,
  borderRadius: 'var(--os-window-radius, 4px)',
  boxShadow: 'var(--os-window-shadow, 3px 3px 12px rgba(0,0,0,0.4))',
}

/** Beveled push-button used by the standalone dialogs. */
export const beveledButton = {
  color: RETRO_PALETTE.text,
  background: RETRO_PALETTE.button,
  border: `2px solid ${RETRO_PALETTE.buttonBorder}`,
  borderTopColor: RETRO_PALETTE.borderLight,
  borderLeftColor: RETRO_PALETTE.borderLight,
  borderRadius: 'var(--os-btn-radius, 3px)',
}
