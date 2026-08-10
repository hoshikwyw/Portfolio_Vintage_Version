import { useEffect, useState } from 'react'
import { useOS } from '@/os/hooks/useOS'
import { Z_LAYERS } from '@/os/constants'
import { system } from '@/shared/config/profile'
import { FONT_STACK } from '@/shared/constants/fonts'

const STORAGE_KEY = 'kayv-welcomed'
const SHOW_DELAY = 600

// Deep-links rendered in the dialog body.
const links = [
  { id: 'Home', label: 'About Me', suffix: 'Learn who I am' },
  { id: 'Projects', label: 'Projects', suffix: "See what I've built" },
  { id: 'Send-Message', label: 'Terminal', suffix: 'Try typing', code: 'neofetch' },
]

/** First-visit welcome dialog (shown once per session). */
const WelcomeDialog = () => {
  const { openWindow } = useOS()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return
    const timer = setTimeout(() => setShow(true), SHOW_DELAY)
    return () => clearTimeout(timer)
  }, [])

  if (!show) return null

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, '1')
    setShow(false)
  }

  const handleOpen = (id) => {
    dismiss()
    openWindow(id)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: Z_LAYERS.dialog, background: 'rgba(0,0,0,0.4)' }}>
      <div
        style={{
          width: 340,
          background: 'var(--os-window)',
          border: '2px solid var(--os-border-dark)',
          borderTopColor: 'var(--os-border-light)',
          borderLeftColor: 'var(--os-border-light)',
          borderRadius: 'var(--os-window-radius)',
          boxShadow: 'var(--os-window-shadow)',
          fontFamily: FONT_STACK,
          backdropFilter: 'var(--os-glass-blur)',
          WebkitBackdropFilter: 'var(--os-glass-blur)',
        }}
      >
        {/* Title bar */}
        <div
          className="flex items-center justify-between px-2 py-1"
          style={{ background: 'var(--os-titlebar)', borderRadius: 'calc(var(--os-window-radius) - 2px) calc(var(--os-window-radius) - 2px) 0 0' }}
        >
          <span className="text-[11px] font-bold text-[#e0d8c8] uppercase tracking-wide">Welcome</span>
          <button
            onClick={dismiss}
            aria-label="Close welcome dialog"
            className="w-4 h-4 flex items-center justify-center text-[#e0d8c8] hover:text-white cursor-pointer"
            style={{
              background: 'linear-gradient(180deg, #6a6a7a, #4a4a5a)',
              border: '1px solid #2a2a3a',
              borderTopColor: '#8a8a9a',
              borderLeftColor: '#8a8a9a',
              borderRadius: '2px',
              fontSize: '10px',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex gap-3 mb-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-sm bg-gradient-to-br from-[#4a3aad] to-[#2b2b3d] flex items-center justify-center">
              <span className="text-white text-xs font-black">K</span>
            </div>
            <div>
              <p className="text-[12px] font-bold text-[#2b2b3d] mb-1">Welcome to {system.name} v{system.version}</p>
              <p className="text-[11px] text-[#4a4a4a] leading-relaxed">
                This is my interactive portfolio. Click the desktop icons or use the taskbar to explore.
              </p>
            </div>
          </div>

          <div className="text-[10px] text-[#5a5a5a] space-y-1 mb-4 pl-11">
            {links.map((link) => (
              <p key={link.id}>
                <button
                  type="button"
                  className="cursor-pointer text-[#4a3aad] underline hover:text-[#2b2b3d]"
                  onClick={() => handleOpen(link.id)}
                >
                  {link.label}
                </button>{' '}
                — {link.suffix}
                {link.code && <> <code className="bg-[#e8e0d4] px-1 rounded-sm">{link.code}</code></>}
              </p>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={dismiss}
              className="px-6 py-1 text-[11px] font-bold text-[#2b2b3d] cursor-pointer hover:brightness-105 active:brightness-95 uppercase tracking-wide"
              style={{
                background: 'linear-gradient(180deg, #d0c8b8, #b0a898)',
                border: '2px solid #7a7060',
                borderTopColor: '#e0d8c8',
                borderLeftColor: '#e0d8c8',
                borderRadius: '3px',
              }}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomeDialog
