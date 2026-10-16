import { useEffect, useState } from 'react'
import { MONO_STACK } from '@/shared/constants/fonts'
import { system } from '@/shared/config/profile'

/** Inner width of the ASCII header box, in characters. */
const BANNER_WIDTH = 31

/** Centre `text` between the box's side walls, padding with spaces. */
const bannerLine = (text) => {
  const left = Math.floor((BANNER_WIDTH - text.length) / 2)
  return `║${' '.repeat(left)}${text}${' '.repeat(BANNER_WIDTH - text.length - left)}║`
}

/*
 * Built rather than typed, so the walls line up whatever `system.version`
 * says. The hand-padded version was one column short on both lines, leaving
 * the right wall adrift of its corners.
 */
const BANNER = [
  `╔${'═'.repeat(BANNER_WIDTH)}╗`,
  bannerLine(`${system.name}  v${system.version}`),
  bannerLine('Vintage Desktop System'),
  `╚${'═'.repeat(BANNER_WIDTH)}╝`,
].join('\n')

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
const BootSplash = ({ onFinish = () => {} }) => {
  const [percent, setPercent] = useState(0)
  const [loadingText, setLoadingText] = useState(LOADING_MESSAGES[0])

  useEffect(() => {
    let current = 0
    let messageIndex = 0
    let finishTimer = null

    const timer = setInterval(() => {
      current += Math.floor(Math.random() * 15) + 5
      if (current >= 100) {
        current = 100
        clearInterval(timer)
        setLoadingText('System ready.')
        finishTimer = setTimeout(onFinish, 600)
      } else {
        const newIndex = Math.floor((current / 100) * LOADING_MESSAGES.length)
        if (newIndex < LOADING_MESSAGES.length && newIndex !== messageIndex) {
          messageIndex = newIndex
          setLoadingText(LOADING_MESSAGES[messageIndex])
        }
      }
      setPercent(current)
    }, 300)

    // The finish timer too: unmounting in that last 600ms (StrictMode's
    // double-mount, or a route change) must not fire `onFinish` afterwards.
    // Any key or click skips straight to the desktop.
    const skip = () => onFinish()
    window.addEventListener('keydown', skip)
    window.addEventListener('pointerdown', skip)

    return () => {
      clearInterval(timer)
      clearTimeout(finishTimer)
      window.removeEventListener('keydown', skip)
      window.removeEventListener('pointerdown', skip)
    }
  }, [onFinish])

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'var(--os-terminal-bg)', fontFamily: MONO_STACK }}
    >
      {/* CRT scanlines */}
      <div className="os-scanlines opacity-[0.05]" />

      <div className="relative z-10 max-w-md w-11/12 flex flex-col gap-6" style={{ color: 'var(--os-terminal-accent)' }}>
        {/* ASCII-style header */}
        <div className="text-center">
          <pre role="img" className="inline-block text-left text-[10px] sm:text-xs leading-tight opacity-60" aria-label={`${system.name} v${system.version}`}>
            {BANNER}
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
        <p className="text-center text-[10px]" style={{ color: 'var(--os-terminal-prompt)' }}>
          Press any key or click to skip
        </p>
        <p className="text-center text-[9px] opacity-40">(c) {new Date().getFullYear()} Kayv Development — All rights reserved</p>
      </div>
    </div>
  )
}

export default BootSplash
