import { MONO_STACK } from '@/shared/constants/fonts'

/**
 * Retro terminal-style 404, rendered inside a window frame when an unknown
 * app id reaches the window registry. `title` names what was not found.
 *
 * Themed from the `--os-terminal-*` tokens like the real terminal, so it turns
 * to ink-on-paper in the light theme instead of staying phosphor green.
 */
const NotFound = ({ title, message = 'The requested window could not be found.' }) => (
  <div
    className="w-full h-full flex flex-col items-center justify-center gap-3 p-6 text-center"
    style={{ background: 'var(--os-terminal-bg)', fontFamily: MONO_STACK }}
  >
    <pre className="text-xs leading-tight select-none" style={{ color: 'var(--os-terminal-path)' }}>{`  ┌───────────┐
  │  4 0 4    │
  │  ¯\\_(ツ)_/¯ │
  └───────────┘`}</pre>

    <p
      className="text-sm font-bold uppercase tracking-widest"
      style={{ color: 'var(--os-terminal-accent)' }}
    >
      Not Found
    </p>

    <p
      className="text-[12px] leading-relaxed max-w-xs"
      style={{ color: 'var(--os-terminal-prompt)' }}
    >
      {title ? (
        <>
          <span style={{ color: 'var(--os-terminal-plain)' }}>{title}</span> — {message}
        </>
      ) : (
        message
      )}
    </p>

    <p className="text-[10px]" style={{ color: 'var(--os-terminal-muted)' }}>Kayv OS · error 404</p>
  </div>
)

export default NotFound
