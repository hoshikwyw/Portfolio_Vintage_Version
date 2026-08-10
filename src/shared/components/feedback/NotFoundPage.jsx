import { Link, useLocation } from 'react-router-dom'
import { FONT_STACK, MONO_STACK } from '@/shared/constants/fonts'
import { RETRO_PALETTE as palette, beveledPanel, beveledButton } from '@/shared/constants/palette'

/**
 * Full-page 404 for unmatched routes (react-router `path="*"`). Styled as a
 * standalone retro error window with a link back to the desktop.
 *
 * Renders outside the OS shell, so it uses the literal palette rather than the
 * `--os-*` CSS variables.
 */
const NotFoundPage = () => {
  const { pathname } = useLocation()

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ background: palette.desktop, fontFamily: FONT_STACK }}
    >
      <div style={{ ...beveledPanel, width: 380, maxWidth: '100%' }}>
        {/* Title bar */}
        <div className="px-2 py-1" style={{ background: palette.titlebar }}>
          <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: palette.titleText }}>
            Kayv OS — Page Not Found
          </span>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col items-center text-center gap-3">
          <pre className="text-[#4a4a6a] text-xs leading-tight select-none">{`  ┌───────────┐
  │  4 0 4    │
  │  ¯\\_(ツ)_/¯ │
  └───────────┘`}</pre>

          <p className="text-[13px] font-bold" style={{ color: palette.text }}>
            This page could not be found.
          </p>

          <p
            className="text-[11px] px-2 py-1 max-w-full overflow-hidden text-ellipsis"
            style={{ color: palette.text, opacity: 0.8, fontFamily: MONO_STACK }}
          >
            {pathname}
          </p>

          <Link
            to="/"
            className="mt-1 no-underline px-5 py-1.5 text-[11px] font-bold cursor-pointer hover:brightness-105 active:brightness-95 uppercase tracking-wide"
            style={beveledButton}
          >
            Return to Desktop
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
