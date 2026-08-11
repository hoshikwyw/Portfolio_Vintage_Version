import Panel from '@/shared/components/ui/Panel'
import { SYSTEM_THEME, getTheme, themes } from '@/shared/config/theme'

const CheckBadge = ({ className, size }) => (
  <div className={className} style={{ background: 'var(--os-accent)' }}>
    <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#fff' }}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  </div>
)

/**
 * Miniature window rendered inside each theme swatch, drawn from the theme's
 * own `previewChrome` so this component needs no per-theme branching.
 */
const ThemePreview = ({ chrome }) => (
  <div
    style={{
      background: chrome.background,
      border: chrome.border,
      borderRadius: chrome.radius,
      height: 28,
      marginBottom: 4,
      overflow: 'hidden',
    }}
  >
    <div style={{ background: chrome.titlebar, height: 8 }} />
  </div>
)

/**
 * Chrome theme selector.
 *
 * @param {string} value         The stored preference — may be `system`.
 * @param {string} resolvedTheme What `system` currently resolves to, shown as a
 *   hint on the System card so the choice is not a black box.
 */
const ThemePicker = ({ value, onChange, resolvedTheme }) => (
  <Panel title="Theme" style={{ padding: '12px 14px' }}>
    <div className="grid grid-cols-2 gap-3 mt-1">
      {themes.map((theme) => {
        const isSelected = value === theme.key
        const isSystem = theme.key === SYSTEM_THEME
        const resolvedLabel = isSystem ? getTheme(resolvedTheme)?.label : null

        return (
          <button
            key={theme.key}
            onClick={() => onChange(theme.key)}
            aria-pressed={isSelected}
            className="text-left p-3 cursor-pointer transition-all relative overflow-hidden"
            style={{
              background: theme.preview,
              border: `2px solid ${isSelected ? 'var(--os-accent)' : 'var(--os-border-dark)'}`,
              borderRadius: 'var(--os-window-radius)',
              boxShadow: isSelected ? '0 0 0 2px var(--os-accent)' : 'none',
              minHeight: 70,
            }}
          >
            <ThemePreview chrome={theme.previewChrome} />
            <p className="text-[10px] font-bold" style={{ color: theme.previewText }}>
              {theme.label}
            </p>
            <p className="text-[8px]" style={{ color: theme.previewText, opacity: 0.6 }}>
              {/* Once System is active, the resolution is more useful than the blurb. */}
              {isSelected && resolvedLabel ? `Currently: ${resolvedLabel}` : theme.desc}
            </p>
            {isSelected && (
              <CheckBadge
                className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                size="w-2.5 h-2.5"
              />
            )}
          </button>
        )
      })}
    </div>
  </Panel>
)

export { CheckBadge }
export default ThemePicker
