import { adminColors, adminStyles } from '@/features/admin/theme'

/** Beveled fieldset with an uppercase legend. */
export const Fieldset = ({ title, children, className = '' }) => (
  <fieldset style={adminStyles.fieldset} className={className}>
    <legend className="text-[10px] font-bold px-1 uppercase tracking-wide" style={{ color: adminColors.text }}>
      {title}
    </legend>
    {children}
  </fieldset>
)

/** Small uppercase field label. */
export const Label = ({ children }) => (
  <label className="block text-[9px] font-bold uppercase mb-0.5" style={{ color: adminColors.label }}>
    {children}
  </label>
)

/** Labeled text/number input. */
export const Field = ({ label, as: As = 'input', className = '', ...props }) => (
  <div>
    {label && <Label>{label}</Label>}
    <As className={`w-full text-[11px] px-1.5 py-1 outline-none ${className}`} style={adminStyles.input} {...props} />
  </div>
)

/** Checkbox with an inline caption. */
export const Checkbox = ({ label, accent = adminColors.accent, ...props }) => (
  <label className="flex items-center gap-1.5 text-[10px] cursor-pointer" style={{ color: adminColors.text }}>
    <input type="checkbox" style={{ accentColor: accent }} {...props} />
    <span className="font-semibold">{label}</span>
  </label>
)

const VARIANT_STYLES = {
  default: adminStyles.button,
  danger: adminStyles.dangerButton,
  primary: adminStyles.primaryButton,
}

/** Beveled push-button. */
export const Button = ({ variant = 'default', className = '', children, ...props }) => (
  <button
    className={
      'font-bold uppercase tracking-wide cursor-pointer transition-[filter,transform] duration-150 ' +
      'hover:brightness-105 active:brightness-95 active:scale-[0.97] ' +
      'disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 ' +
      className
    }
    style={VARIANT_STYLES[variant]}
    {...props}
  >
    {children}
  </button>
)

/** Notebook-style tab header. */
export const Tab = ({ active, children, ...props }) => (
  <button
    className="px-3 py-1 text-[11px] font-bold uppercase tracking-wide cursor-pointer transition-[background,color,filter] duration-150 hover:brightness-105"
    style={{
      background: active ? adminColors.panel : 'var(--os-btn-bg)',
      border: `2px solid ${adminColors.borderDark}`,
      borderTopColor: adminColors.borderLight,
      borderLeftColor: adminColors.borderLight,
      borderBottomColor: active ? adminColors.panel : adminColors.borderDark,
      borderRadius: 'var(--os-btn-radius) var(--os-btn-radius) 0 0',
      // Inactive tabs sit back rather than using a second hardcoded beige.
      opacity: active ? 1 : 0.72,
      color: active ? adminColors.text : adminColors.textMuted,
      // Overlap the panel border so the active tab reads as connected to it.
      marginBottom: active ? '-2px' : 0,
      position: 'relative',
      zIndex: active ? 1 : 0,
    }}
    {...props}
  >
    {children}
  </button>
)

/** Transient success / error notice. */
export const Banner = ({ message }) => {
  if (!message) return null
  const isError = message.tone === 'error'

  return (
    <div
      role="status"
      className="mb-2 px-3 py-1.5 text-[11px] font-semibold"
      style={{
        background: isError ? 'var(--os-notice-error-bg)' : 'var(--os-notice-ok-bg)',
        border: `1px solid ${isError ? 'var(--os-notice-error-border)' : 'var(--os-notice-ok-border)'}`,
        borderRadius: 'var(--os-btn-radius)',
        color: isError ? 'var(--os-notice-error-text)' : 'var(--os-notice-ok-text)',
      }}
    >
      {message.text}
    </div>
  )
}

/** Empty-state line inside a fieldset. */
export const EmptyState = ({ children }) => (
  <p className="text-[11px] text-center py-2" style={{ color: adminColors.textFaint }}>{children}</p>
)
