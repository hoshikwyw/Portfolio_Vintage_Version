/**
 * Retro beveled `<fieldset>` with an uppercase legend — the section container
 * used by the About, Settings and Admin windows.
 */
const Panel = ({ title, children, className = '', style }) => (
  <fieldset
    className={className}
    style={{
      border: 'var(--os-fieldset-border)',
      borderRadius: 'var(--os-btn-radius)',
      padding: '12px',
      ...style,
    }}
  >
    {title && (
      <legend
        className="px-1 uppercase"
        style={{ fontSize: 10, fontWeight: 700, color: 'var(--os-text)', letterSpacing: '0.05em' }}
      >
        {title}
      </legend>
    )}
    {children}
  </fieldset>
)

export default Panel
