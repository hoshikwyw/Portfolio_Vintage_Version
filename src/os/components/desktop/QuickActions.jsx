import { Mail, Download } from 'lucide-react'
import { downloadResume, openHireEmail } from '@/shared/lib/browser'

/** Floating résumé + hire shortcuts anchored above the taskbar. */
export default function QuickActions() {
  return (
    <div // Stacked above the helper bot, which now occupies the bottom-right corner.
    className="absolute bottom-32 right-4 z-10 flex flex-col gap-1.5">
      <button onClick={downloadResume} className="quick-action-btn group" title="Download Resume">
        <Download size={14} className="flex-shrink-0" />
        <span>Resume</span>
      </button>
      <button onClick={() => openHireEmail()} className="quick-action-btn quick-action-primary group" title="Hire Me">
        <Mail size={14} className="flex-shrink-0" />
        <span>Hire Me</span>
      </button>
    </div>
  )
}
