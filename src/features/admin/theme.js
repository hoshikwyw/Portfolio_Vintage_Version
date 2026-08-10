/**
 * Admin chrome tokens.
 *
 * The dashboard deliberately keeps its own fixed Win95 skin rather than
 * following the user's theme — it is a tool, not part of the portfolio's
 * presentation. These were previously loose `inputStyle` / `btnStyle` objects
 * duplicated across the dashboard and login screen.
 */
export const adminColors = {
  window: '#e8e0d4',
  panel: '#c0b8a8',
  field: '#f0ebe3',
  borderDark: '#8a8070',
  borderLight: '#e0d8c8',
  borderField: '#a0a090',
  text: '#2b2b3d',
  textMuted: '#5a5a5a',
  textFaint: '#6a6a6a',
  label: '#4a4a4a',
  accent: '#4a3aad',
  success: '#4a8a4a',
  warning: '#8a7030',
  danger: '#8a3030',
}

export const adminStyles = {
  input: {
    border: `2px inset ${adminColors.borderField}`,
    background: adminColors.field,
    borderRadius: '1px',
    color: adminColors.text,
  },
  button: {
    background: 'linear-gradient(180deg, #d0c8b8, #b0a898)',
    border: '2px solid #7a7060',
    borderTopColor: adminColors.borderLight,
    borderLeftColor: adminColors.borderLight,
    borderRadius: '3px',
    color: adminColors.text,
  },
  dangerButton: {
    background: 'linear-gradient(180deg, #c8a0a0, #a08080)',
    border: '2px solid #7a5050',
    borderTopColor: '#d0b8b8',
    borderLeftColor: '#d0b8b8',
    borderRadius: '3px',
    color: adminColors.text,
  },
  primaryButton: {
    background: 'linear-gradient(180deg, #5a4acd, #4a3aad)',
    color: '#fff',
    border: '2px solid #3a2a8d',
    borderTopColor: '#6a5add',
    borderLeftColor: '#6a5add',
    borderRadius: '3px',
  },
  fieldset: {
    border: '2px groove #c0b8a8',
    borderRadius: '2px',
    padding: '10px 12px',
  },
  row: {
    background: adminColors.window,
    border: `1px solid ${adminColors.borderField}`,
    borderRadius: '2px',
  },
}
