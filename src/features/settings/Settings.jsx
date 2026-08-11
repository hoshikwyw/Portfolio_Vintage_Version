import { useOSActions, useOSAppearance } from '@/os/hooks/useOS'
import Panel from '@/shared/components/ui/Panel'
import { FONT_STACK } from '@/shared/constants/fonts'
import { profile, system } from '@/shared/config/profile'
import ThemePicker from './components/ThemePicker'
import WallpaperPicker from './components/WallpaperPicker'

const aboutRows = [
  ['System', system.name],
  ['Version', system.version],
  ['Built with', system.builtWith],
  ['Developer', profile.name],
]

/** Appearance preferences plus a read-only "about this system" panel. */
const Settings = () => {
  const { wallpaper, theme, resolvedTheme } = useOSAppearance()
  const { setWallpaper, setTheme } = useOSActions()

  return (
    <div className="w-full h-full overflow-y-auto p-4" style={{ fontFamily: FONT_STACK }}>
      <div className="max-w-md mx-auto space-y-4">
        {/*
          The picker shows the stored preference (so "System" reads as selected)
          while the swatches below need the theme actually rendering.
        */}
        <ThemePicker value={theme} onChange={setTheme} resolvedTheme={resolvedTheme} />
        <WallpaperPicker value={wallpaper} onChange={setWallpaper} resolvedTheme={resolvedTheme} />

        <Panel title="About" style={{ padding: '12px 14px' }}>
          <div className="space-y-1.5 text-[11px] mt-1" style={{ color: 'var(--os-text)' }}>
            {aboutRows.map(([label, value]) => (
              <div key={label} className="flex justify-between">
                <span>{label}</span>
                <span className="font-bold">{value}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  )
}

export default Settings
