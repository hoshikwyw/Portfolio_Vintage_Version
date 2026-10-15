import { Link, useLocation } from 'react-router-dom'
import { MONO_STACK } from '@/shared/constants/fonts'
import { RETRO_PALETTE as palette, beveledButton, beveledButtonClass } from '@/shared/constants/palette'
import NotFoundArt from './NotFoundArt'
import RetroDialog from './RetroDialog'

/**
 * Full-page 404 for unmatched routes (react-router `path="*"`). Styled as a
 * standalone retro error window with a link back to the desktop.
 *
 * Renders outside the OS shell, so it draws from `RETRO_PALETTE` — CSS
 * variables with literal fallbacks, which follow the theme when the stylesheet
 * is present and degrade to the classic skin when it is not.
 */
const NotFoundPage = () => {
  const { pathname } = useLocation()

  return (
    <RetroDialog title="Kayv OS — Page Not Found" width={380}>
      <div className="p-5 flex flex-col items-center text-center gap-3">
        <NotFoundArt color={palette.muted} />

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
          className={`mt-1 no-underline px-5 py-1.5 text-[11px] ${beveledButtonClass}`}
          style={beveledButton}
        >
          Return to Desktop
        </Link>
      </div>
    </RetroDialog>
  )
}

export default NotFoundPage
