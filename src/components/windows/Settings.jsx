import { useOS } from '@/context/OSContext'
import { FONT_STACK } from '@/shared/constants/fonts'
import { wallpapers, themes } from '@/shared/config/theme'
import { system, profile } from '@/shared/config/profile'

const aboutRows = [
  ['System', system.name],
  ['Version', system.version],
  ['Built with', system.builtWith],
  ['Developer', profile.name],
]

const Settings = () => {
  const { wallpaper, setWallpaper, theme, setTheme } = useOS()

  return (
    <div className="w-full h-full overflow-y-auto p-4" style={{ fontFamily: FONT_STACK }}>
      <div className="max-w-md mx-auto space-y-4">
        {/* Theme Section */}
        <fieldset style={{ border: 'var(--os-fieldset-border)', borderRadius: 'var(--os-btn-radius)', padding: '12px 14px' }}>
          <legend className="text-[10px] font-bold px-1 uppercase tracking-wide" style={{ color: 'var(--os-text)' }}>Theme</legend>
          <div className="grid grid-cols-2 gap-3 mt-1">
            {themes.map((t) => (
              <button
                key={t.key}
                onClick={() => setTheme(t.key)}
                className="text-left p-3 cursor-pointer transition-all"
                style={{
                  background: t.preview,
                  border: theme === t.key ? '2px solid var(--os-accent)' : '2px solid var(--os-border-dark)',
                  borderRadius: 'var(--os-window-radius)',
                  boxShadow: theme === t.key ? '0 0 0 2px var(--os-accent)' : 'none',
                  minHeight: 70,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Mini window preview */}
                <div style={{
                  background: t.key === 'glass' ? 'rgba(255,255,255,0.1)' : '#c0b8a8',
                  borderRadius: t.key === 'glass' ? '6px' : '3px',
                  border: t.key === 'glass' ? '1px solid rgba(255,255,255,0.15)' : '1px solid #8a8070',
                  height: 28,
                  marginBottom: 4,
                }}>
                  <div style={{
                    background: t.key === 'glass' ? 'rgba(255,255,255,0.08)' : 'linear-gradient(180deg, #4a4a6a, #2b2b3d)',
                    height: 8,
                    borderRadius: t.key === 'glass' ? '6px 6px 0 0' : '3px 3px 0 0',
                  }} />
                </div>
                <p className="text-[10px] font-bold text-white">{t.label}</p>
                <p className="text-[8px] text-white/50">{t.desc}</p>
                {theme === t.key && (
                  <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'var(--os-accent)' }}>
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Wallpaper Section */}
        <fieldset style={{ border: 'var(--os-fieldset-border)', borderRadius: 'var(--os-btn-radius)', padding: '12px 14px' }}>
          <legend className="text-[10px] font-bold px-1 uppercase tracking-wide" style={{ color: 'var(--os-text)' }}>Wallpaper</legend>
          <div className="grid grid-cols-3 gap-2 mt-1">
            {wallpapers.map((wp) => (
              <button
                key={wp.key}
                onClick={() => setWallpaper(wp.key)}
                className="relative h-14 overflow-hidden cursor-pointer"
                style={{
                  background: wp.gradient,
                  border: wallpaper === wp.key ? '2px solid var(--os-accent)' : '2px solid var(--os-border-dark)',
                  borderRadius: 'var(--os-btn-radius)',
                  boxShadow: wallpaper === wp.key ? '0 0 0 1px var(--os-accent)' : 'none',
                }}
              >
                <div className="absolute inset-0 flex items-end justify-center pb-1">
                  <span className="text-[8px] text-white/80 font-bold uppercase tracking-wider" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>{wp.label}</span>
                </div>
                {wallpaper === wp.key && (
                  <div className="absolute top-1 right-1 w-3 h-3 rounded-sm flex items-center justify-center" style={{ background: 'var(--os-accent)' }}>
                    <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </fieldset>

        {/* About */}
        <fieldset style={{ border: 'var(--os-fieldset-border)', borderRadius: 'var(--os-btn-radius)', padding: '12px 14px' }}>
          <legend className="text-[10px] font-bold px-1 uppercase tracking-wide" style={{ color: 'var(--os-text)' }}>About</legend>
          <div className="space-y-1.5 text-[11px] mt-1" style={{ color: 'var(--os-text)' }}>
            {aboutRows.map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span>{k}</span><span className="font-bold">{v}</span>
              </div>
            ))}
          </div>
        </fieldset>
      </div>
    </div>
  )
}

export default Settings
