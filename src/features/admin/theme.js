/**
 * Admin chrome tokens.
 *
 * The dashboard used to keep its own fixed Win95 skin on the grounds that it
 * is a tool rather than part of the portfolio's presentation. In practice that
 * meant the one window that ignored the theme picker — jarring next to a glass
 * or light desktop, and a second palette to keep in step by hand.
 *
 * Every value now maps onto the shared `--os-*` tokens, so the dashboard
 * re-skins with everything else. The key names are unchanged, so the consuming
 * components did not have to move.
 *
 * These are plain CSS variable *references*, not resolved colours — they only
 * mean anything once handed to a `style` prop.
 */
export const adminColors = {
  window: 'var(--os-panel-bg)',
  panel: 'var(--os-window)',
  field: 'var(--os-input-bg)',
  borderDark: 'var(--os-border-dark)',
  borderLight: 'var(--os-border-light)',
  borderField: 'var(--os-border-dark)',
  text: 'var(--os-text)',
  textMuted: 'var(--os-text-secondary)',
  textFaint: 'var(--os-text-muted)',
  label: 'var(--os-text-secondary)',
  accent: 'var(--os-accent)',
  success: 'var(--os-success)',
  warning: 'var(--os-warning)',
  danger: 'var(--os-danger)',
}

export const adminStyles = {
  input: {
    border: 'var(--os-input-border)',
    background: 'var(--os-input-bg)',
    borderRadius: 'var(--os-btn-radius)',
    color: 'var(--os-text)',
  },
  button: {
    background: 'var(--os-btn-bg)',
    border: '2px solid var(--os-btn-border-bottom)',
    borderTopColor: 'var(--os-btn-border-top)',
    borderLeftColor: 'var(--os-btn-border-top)',
    borderRadius: 'var(--os-btn-radius)',
    color: 'var(--os-text)',
  },
  /*
   * The destructive and primary buttons are solid fills rather than the beveled
   * gradient. A hand-mixed red or indigo bevel only reads correctly against
   * beige chrome; a solid accent carries its own contrast on any of the three
   * themes, and white-on-accent stays legible throughout.
   */
  dangerButton: {
    background: 'var(--os-danger)',
    border: '2px solid var(--os-danger)',
    borderRadius: 'var(--os-btn-radius)',
    color: '#fff',
  },
  primaryButton: {
    background: 'var(--os-accent)',
    border: '2px solid var(--os-accent)',
    borderRadius: 'var(--os-btn-radius)',
    color: '#fff',
  },
  fieldset: {
    border: 'var(--os-fieldset-border)',
    borderRadius: 'var(--os-btn-radius)',
    padding: '10px 12px',
  },
  row: {
    background: 'var(--os-panel-bg)',
    border: '1px solid var(--os-border-dark)',
    borderRadius: 'var(--os-btn-radius)',
  },
}
