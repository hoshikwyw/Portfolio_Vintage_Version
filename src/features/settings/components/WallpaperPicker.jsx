import Panel from '@/shared/components/ui/Panel'
import { wallpapers } from '@/shared/config/theme'
import { CheckBadge } from './ThemePicker'

const WallpaperPicker = ({ value, onChange }) => (
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
              background: wallpaper.gradient,
              border: `2px solid ${isSelected ? 'var(--os-accent)' : 'var(--os-border-dark)'}`,
              borderRadius: 'var(--os-btn-radius)',
              boxShadow: isSelected ? '0 0 0 1px var(--os-accent)' : 'none',
            }}
          >
            <div className="absolute inset-0 flex items-end justify-center pb-1">
              <span
                className="text-[8px] text-white/80 font-bold uppercase tracking-wider"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
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

export default WallpaperPicker
