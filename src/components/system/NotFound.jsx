import { MONO_STACK } from '@/constants/ui'

/**
 * Retro terminal-style 404, rendered inside a window frame when an unknown
 * app id reaches the window registry. `title` names what was not found.
 */
const NotFound = ({ title, message = 'The requested window could not be found.' }) => (
  <div
    className="w-full h-full flex flex-col items-center justify-center gap-3 p-6 text-center"
    style={{ background: 'var(--os-terminal-bg, #1a1a2a)', fontFamily: MONO_STACK }}
  >
    <pre className="text-[#6a6aaa] text-xs leading-tight select-none">{`  ┌───────────┐
  │  4 0 4    │
  │  ¯\\_(ツ)_/¯ │
  └───────────┘`}</pre>

    <p className="text-[#a0d0a0] text-sm font-bold uppercase tracking-widest">Not Found</p>

    <p className="text-[#6a8a6a] text-[12px] leading-relaxed max-w-xs">
      {title ? (
        <>
          <span className="text-[#e0d8c8]">{title}</span> — {message}
        </>
      ) : (
        message
      )}
    </p>

    <p className="text-[#4a6a4a] text-[10px]">Kayv OS · error 404</p>
  </div>
)

export default NotFound
