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
    className={`font-bold uppercase tracking-wide cursor-pointer hover:brightness-105 active:brightness-95 disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
    style={VARIANT_STYLES[variant]}
    {...props}
  >
    {children}
  </button>
)

/** Notebook-style tab header. */
export const Tab = ({ active, children, ...props }) => (
  <button
    className="px-3 py-1 text-[11px] font-bold uppercase tracking-wide cursor-pointer"
    style={{
      background: active ? adminColors.panel : '#b0a898',
      border: `2px solid ${adminColors.borderDark}`,
      borderTopColor: active ? adminColors.borderLight : '#d0c8b8',
      borderLeftColor: active ? adminColors.borderLight : '#d0c8b8',
      borderBottomColor: active ? adminColors.panel : adminColors.borderDark,
      borderRadius: '3px 3px 0 0',
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
        background: isError ? '#e8c8c8' : '#d8e8d8',
        border: `1px solid ${isError ? '#c08080' : '#80a080'}`,
        borderRadius: '2px',
        color: isError ? '#8a2020' : '#2a4a2a',
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
