import { useEffect, useState } from 'react'
import { MONO_STACK } from '@/shared/constants/fonts'
import { system } from '@/shared/config/profile'

const LOADING_MESSAGES = [
  'Initializing system...',
  'Loading modules...',
  'Preparing interface...',
  'Almost ready...',
]

/**
 * Fake OS boot sequence shown before the desktop mounts. Advances a progress
 * bar in random increments and calls `onFinish` once it reaches 100%.
 */
export default function BootSplash({ onFinish = () => {} }) {
  const [percent, setPercent] = useState(0)
  const [loadingText, setLoadingText] = useState(LOADING_MESSAGES[0])

  useEffect(() => {
    let current = 0
    let messageIndex = 0

    const timer = setInterval(() => {
      current += Math.floor(Math.random() * 15) + 5
      if (current >= 100) {
        current = 100
        clearInterval(timer)
        setLoadingText('System ready.')
        setTimeout(onFinish, 600)
      } else {
        const newIndex = Math.floor((current / 100) * LOADING_MESSAGES.length)
        if (newIndex < LOADING_MESSAGES.length && newIndex !== messageIndex) {
          messageIndex = newIndex
          setLoadingText(LOADING_MESSAGES[messageIndex])
        }
      }
      setPercent(current)
    }, 300)

    return () => clearInterval(timer)
  }, [onFinish])

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'var(--os-terminal-bg)', fontFamily: MONO_STACK }}
    >
      {/* CRT scanlines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, var(--os-terminal-scanline) 1px, var(--os-terminal-scanline) 2px)' }}
      />

      <div className="relative z-10 max-w-md w-11/12 flex flex-col gap-6" style={{ color: 'var(--os-terminal-accent)' }}>
        {/* ASCII-style header */}
        <div className="text-center">
          <pre className="text-[10px] sm:text-xs leading-tight opacity-60">{`
  ╔═══════════════════════════════╗
  ║       ${system.name}  v${system.version}        ║
  ║    Vintage Desktop System    ║
  ╚═══════════════════════════════╝`}
          </pre>
        </div>

        {/* Loading messages */}
        <div className="space-y-1 text-xs">
          <p style={{ color: 'var(--os-terminal-prompt)' }}>[  OK  ] Starting system services...</p>
          <p style={{ color: 'var(--os-terminal-prompt)' }}>[  OK  ] Loading desktop environment...</p>
          <p style={{ color: percent >= 50 ? 'var(--os-terminal-accent)' : 'var(--os-terminal-prompt)' }}>
            [ {percent >= 50 ? ' OK ' : '....'} ] {loadingText}
          </p>
        </div>

        {/* Progress bar */}
        <div>
          <div className="w-full h-3 overflow-hidden" style={{ border: '1px solid var(--os-terminal-muted)', background: 'var(--os-terminal-border)' }}>
            <div
              className="h-full transition-all duration-300 ease-out"
              style={{ width: `${percent}%`, background: 'var(--os-terminal-bar)' }}
            />
          </div>
          <div className="flex justify-between mt-1 text-[10px]">
            <span style={{ color: 'var(--os-terminal-prompt)' }}>{percent}%</span>
            <span style={{ color: percent >= 100 ? 'var(--os-terminal-accent)' : 'var(--os-terminal-muted)' }}>
              {percent < 100 ? 'LOADING' : 'COMPLETE'}
            </span>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[9px] opacity-40 mt-4">(c) 2024 Kayv Development — All rights reserved</p>
      </div>
    </div>
  )
}
