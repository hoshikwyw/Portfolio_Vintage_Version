import { FONT_STACK, MONO_STACK } from '@/shared/constants/fonts'
import { RETRO_PALETTE as palette, beveledPanel, beveledButton } from '@/shared/constants/palette'

/**
 * OS-styled error dialog shown by <ErrorBoundary> when a render crashes.
 *
 * Colours come from `RETRO_PALETTE`, whose entries are CSS variables backed by
 * literal fallbacks — so this follows the user's theme normally, and still
 * renders correctly if the crash happened before the stylesheet applied.
 *
 * @param {Error}    [error]    The caught error (message shown in detail box).
 * @param {Function} [onReset]  Retry handler — re-mounts the boundary's children.
 * @param {'fullscreen'|'inline'} [variant]  Fill the viewport, or just the parent window.
 */
const ErrorScreen = ({ error, onReset, variant = 'fullscreen' }) => {
  const isFullscreen = variant === 'fullscreen'

  const wrapperStyle = isFullscreen
    ? { position: 'fixed', inset: 0, zIndex: 99999, background: palette.desktop }
    : { width: '100%', height: '100%', background: palette.desktop }

  return (
    <div className="flex items-center justify-center p-4" style={{ ...wrapperStyle, fontFamily: FONT_STACK }}>
      <div style={{ ...beveledPanel, width: 360, maxWidth: '100%' }}>
        {/* Title bar */}
        <div className="flex items-center gap-1.5 px-2 py-1" style={{ background: palette.titlebar }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: palette.titleText }}>
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: palette.titleText }}>
            System Error
          </span>
        </div>

        {/* Body */}
        <div className="p-4">
          <p className="text-[12px] font-bold mb-1" style={{ color: palette.text }}>
            Something went wrong.
          </p>
          <p className="text-[11px] leading-relaxed mb-3" style={{ color: palette.text, opacity: 0.85 }}>
            An unexpected error crashed this part of Kayv OS. You can retry — if it
            keeps happening, please reload the page.
          </p>

          {error?.message && (
            <pre
              className="text-[10px] leading-snug mb-3 p-2 overflow-auto whitespace-pre-wrap"
              style={{
                maxHeight: 96,
                color: palette.danger,
                background: palette.field,
                border: palette.fieldBorder,
                borderRadius: 'var(--os-btn-radius, 2px)',
                fontFamily: MONO_STACK,
              }}
            >
              {error.message}
            </pre>
          )}

          <div className="flex justify-end gap-2">
            {onReset && (
              <button
                onClick={onReset}
                className="px-4 py-1 text-[11px] font-bold cursor-pointer hover:brightness-105 active:brightness-95 uppercase tracking-wide"
                style={beveledButton}
              >
                Retry
              </button>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-1 text-[11px] font-bold cursor-pointer hover:brightness-105 active:brightness-95 uppercase tracking-wide"
              style={beveledButton}
            >
              Reload
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ErrorScreen
