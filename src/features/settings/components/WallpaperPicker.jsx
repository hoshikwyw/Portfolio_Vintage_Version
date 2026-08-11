import Panel from '@/shared/components/ui/Panel'
import { gradientFor, isLightTheme, wallpapers } from '@/shared/config/theme'
import { CheckBadge } from './ThemePicker'

/**
 * @param {string} resolvedTheme Decides which rendition of each wallpaper the
 *   swatch shows, so the preview matches what the desktop will actually paint.
 */
const WallpaperPicker = ({ value, onChange, resolvedTheme }) => {
  // The label sits directly on the swatch, so it flips along with it.
  const isLight = isLightTheme(resolvedTheme)
  const labelColor = isLight ? 'rgba(33,35,46,0.85)' : 'rgba(255,255,255,0.8)'
  const labelShadow = isLight ? '0 1px 2px rgba(255,255,255,0.9)' : '0 1px 2px rgba(0,0,0,0.8)'

  return (
    <Panel title="Wallpaper" style={{ padding: '12px 14px' }}>
      <div className="grid grid-cols-3 gap-2 mt-1">
        {wallpapers.map((wallpaper) => {
          const isSelected = value === wallpaper.key

          return (
            <button
              key={wallpaper.key}
              onClick={() => onChange(wallpaper.key)}
              aria-pressed={isSelected}
              className="relative h-14 overflow-hidden cursor-pointer"
              style={{
                background: gradientFor(wallpaper, resolvedTheme),
                border: `2px solid ${isSelected ? 'var(--os-accent)' : 'var(--os-border-dark)'}`,
                borderRadius: 'var(--os-btn-radius)',
                boxShadow: isSelected ? '0 0 0 1px var(--os-accent)' : 'none',
              }}
            >
              <div className="absolute inset-0 flex items-end justify-center pb-1">
                <span
                  className="text-[8px] font-bold uppercase tracking-wider"
                  style={{ color: labelColor, textShadow: labelShadow }}
                >
                  {wallpaper.label}
                </span>
              </div>
              {isSelected && (
                <CheckBadge
                  className="absolute top-1 right-1 w-3 h-3 rounded-sm flex items-center justify-center"
                  size="w-2 h-2"
                />
              )}
            </button>
          )
        })}
      </div>
    </Panel>
  )
}

export default WallpaperPicker
