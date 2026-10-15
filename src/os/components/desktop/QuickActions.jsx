import { Mail, Download } from 'lucide-react'
import { Z_LAYERS } from '@/os/constants'
import { downloadResume, openHireEmail } from '@/shared/lib/browser'

/**
 * Floating résumé + hire shortcuts.
 *
 * Anchored top-right, mirroring the desktop icons at top-left. They used to
 * sit above the taskbar, which put them on top of the helper bot once it took
 * the bottom-right corner — and this is the space the sticky note vacated, so
 * the two most important actions on the site now sit above the fold instead of
 * tucked into a corner.
 */
const QuickActions = () => (
  <div className="absolute top-5 right-5 flex flex-col items-end gap-1.5" style={{ zIndex: Z_LAYERS.desktopItem }}>
    <button onClick={downloadResume} className="quick-action-btn group" title="Download Resume">
      <Download size={14} className="flex-shrink-0" />
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
  </div>
)

export default QuickActions
