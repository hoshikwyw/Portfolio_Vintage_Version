import { useNavigate } from 'react-router-dom'
import { FileText, Mail, PanelsTopLeft } from 'lucide-react'
import { Z_LAYERS } from '@/os/constants'
import { PATHS } from '@/shared/config/paths'
import { openHireEmail, openResume } from '@/shared/lib/browser'

/**
 * Floating résumé + hire shortcuts.
 *
 * Anchored top-right, mirroring the desktop icons at top-left. They used to
 * sit above the taskbar, which put them on top of the helper bot once it took
 * the bottom-right corner — and this is the space the sticky note vacated, so
 * the two most important actions on the site now sit above the fold instead of
 * tucked into a corner.
 *
 * "One-page view" leaves the desktop for the plain scrolling site, for
 * visitors who would rather read than explore.
 */
const QuickActions = () => {
  const navigate = useNavigate()

  return (
    <div className="absolute top-5 right-5 flex flex-col items-end gap-1.5" style={{ zIndex: Z_LAYERS.desktopItem }}>
      <button onClick={openResume} className="quick-action-btn group" title="View Resume">
        <FileText size={14} className="flex-shrink-0" />
        <span>Resume</span>
      </button>
      <button
        onClick={() => openHireEmail()}
        className="quick-action-btn quick-action-primary group"
        title="Hire Me"
      >
        <Mail size={14} className="flex-shrink-0" />
        <span>Hire Me</span>
      </button>
      <button
        onClick={() => navigate(PATHS.portfolio)}
        className="quick-action-btn group"
        title="See everything on one scrolling page"
      >
        <PanelsTopLeft size={14} className="flex-shrink-0" />
        <span>One-page view</span>
      </button>
    </div>
  )
}

export default QuickActions
