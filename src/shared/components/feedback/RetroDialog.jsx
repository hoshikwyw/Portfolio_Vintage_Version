import { FONT_STACK } from '@/shared/constants/fonts'
import { RETRO_PALETTE as palette, beveledPanel } from '@/shared/constants/palette'

/**
 * Standalone beveled dialog — title bar plus body — for the surfaces that
 * render outside the OS shell (the crash screen and the full-page 404).
 *
 * Draws only from `RETRO_PALETTE`, so it paints correctly even when the theme
 * stylesheet never loaded.
 *
 * @param {string} title Title-bar text.
 * @param {import('react').ReactNode} [icon] Glyph shown before the title.
 * @param {number} [width] Preferred width in px; never wider than its parent.
 * @param {'fullscreen'|'inline'} [variant] Cover the viewport, or fill the parent.
 */
const RetroDialog = ({ title, icon, width = 360, variant = 'fullscreen', children }) => {
  const wrapperStyle = variant === 'fullscreen'
    ? { position: 'fixed', inset: 0, zIndex: 99999 }
    : { width: '100%', height: '100%' }

  // Covering the viewport, the dialog *is* the page, so it is its main
  // landmark; inside a window it is just part of that window.
  const Wrapper = variant === 'fullscreen' ? 'main' : 'div'

  return (
    <Wrapper
      className="flex items-center justify-center p-4"
      style={{ ...wrapperStyle, background: palette.desktop, fontFamily: FONT_STACK }}
    >
      <div style={{ ...beveledPanel, width, maxWidth: '100%' }}>
        <div className="flex items-center gap-1.5 px-2 py-1" style={{ background: palette.titlebar }}>
          {icon}
          <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: palette.titleText }}>
            {title}
          </span>
        </div>
        {children}
      </div>
    </Wrapper>
  )
}

export default RetroDialog
