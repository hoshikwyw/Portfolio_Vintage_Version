import Panel from '@/shared/components/ui/Panel'
import { themes } from '@/shared/config/theme'

const CheckBadge = ({ className, size }) => (
  <div className={className} style={{ background: 'var(--os-accent)' }}>
    <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#fff' }}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  </div>
)

/** Miniature window rendered inside each theme swatch. */
const ThemePreview = ({ isGlass }) => (
  <div
    style={{
      background: isGlass ? 'rgba(255,255,255,0.1)' : '#c0b8a8',
      borderRadius: isGlass ? '6px' : '3px',
      border: isGlass ? '1px solid rgba(255,255,255,0.15)' : '1px solid #8a8070',
      height: 28,
      marginBottom: 4,
    }}
  >
    <div
      style={{
        background: isGlass ? 'rgba(255,255,255,0.08)' : 'linear-gradient(180deg, #4a4a6a, #2b2b3d)',
        height: 8,
        borderRadius: isGlass ? '6px 6px 0 0' : '3px 3px 0 0',
      }}
    />
  </div>
)

const ThemePicker = ({ value, onChange }) => (
  <Panel title="Theme" style={{ padding: '12px 14px' }}>
    <div className="grid grid-cols-2 gap-3 mt-1">
      {themes.map((theme) => {
        const isSelected = value === theme.key

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
            <ThemePreview isGlass={theme.key === 'glass'} />
            <p className="text-[10px] font-bold text-white">{theme.label}</p>
            <p className="text-[8px] text-white/50">{theme.desc}</p>
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
