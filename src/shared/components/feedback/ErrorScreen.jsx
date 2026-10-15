import { TriangleAlert } from 'lucide-react'
import { MONO_STACK } from '@/shared/constants/fonts'
import { RETRO_PALETTE as palette, beveledButton, beveledButtonClass } from '@/shared/constants/palette'
import RetroDialog from './RetroDialog'

const WarningIcon = () => <TriangleAlert size={12} style={{ color: palette.titleText }} aria-hidden="true" />

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
const ErrorScreen = ({ error, onReset, variant = 'fullscreen' }) => (
  <RetroDialog title="System Error" icon={<WarningIcon />} variant={variant}>
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
          <button onClick={onReset} className={`px-4 py-1 text-[11px] ${beveledButtonClass}`} style={beveledButton}>
            Retry
          </button>
        )}
        <button
          onClick={() => window.location.reload()}
          className={`px-4 py-1 text-[11px] ${beveledButtonClass}`}
          style={beveledButton}
        >
          Reload
        </button>
      </div>
    </div>
  </RetroDialog>
)

export default ErrorScreen
