import { useEffect, useState } from 'react'
import { useOSActions } from '@/os/hooks/useOS'
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
  const { openWindow } = useOSActions()
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
    <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: Z_LAYERS.dialog, background: 'var(--os-scrim)' }}>
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
          <span
            className="text-[11px] font-bold uppercase tracking-wide"
            style={{ color: 'var(--os-titlebar-text)' }}
          >
            Welcome
          </span>
          <button
            onClick={dismiss}
            aria-label="Close welcome dialog"
            className="w-4 h-4 flex items-center justify-center cursor-pointer hover:brightness-110"
            style={{
              color: 'var(--os-titlebar-text)',
              background: 'var(--os-btn-bg)',
              border: '1px solid var(--os-btn-border-bottom)',
              borderTopColor: 'var(--os-btn-border-top)',
              borderLeftColor: 'var(--os-btn-border-top)',
              borderRadius: 'var(--os-btn-radius)',
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
            <div
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, var(--os-accent), var(--os-accent-hover))',
                borderRadius: 'var(--os-btn-radius)',
              }}
            >
              <span className="text-white text-xs font-black">K</span>
            </div>
            <div>
              <p className="text-[12px] font-bold mb-1" style={{ color: 'var(--os-text)' }}>
                Welcome to {system.name} v{system.version}
              </p>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--os-text-secondary)' }}>
                This is my interactive portfolio. Click the desktop icons or use the taskbar to explore.
              </p>
            </div>
          </div>

          <div className="text-[10px] space-y-1 mb-4 pl-11" style={{ color: 'var(--os-text-secondary)' }}>
            {links.map((link) => (
              <p key={link.id}>
                <button
                  type="button"
                  className="cursor-pointer underline hover:brightness-125"
                  style={{ color: 'var(--os-accent)' }}
                  onClick={() => handleOpen(link.id)}
                >
                  {link.label}
                </button>{' '}
                — {link.suffix}
                {link.code && (
                  <>
                    {' '}
                    <code
                      className="px-1"
                      style={{ background: 'var(--os-panel-bg)', borderRadius: 'var(--os-btn-radius)' }}
                    >
                      {link.code}
                    </code>
                  </>
                )}
              </p>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={dismiss}
              className="px-6 py-1 text-[11px] font-bold cursor-pointer hover:brightness-105 active:brightness-95 uppercase tracking-wide"
              style={{
                color: 'var(--os-text)',
                background: 'var(--os-btn-bg)',
                border: '2px solid var(--os-btn-border-bottom)',
                borderTopColor: 'var(--os-btn-border-top)',
                borderLeftColor: 'var(--os-btn-border-top)',
                borderRadius: 'var(--os-btn-radius)',
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
