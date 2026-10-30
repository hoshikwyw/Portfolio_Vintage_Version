import { Link } from 'react-router-dom'
import { FileText, Monitor } from 'lucide-react'
import { PATHS } from '@/shared/config/paths'
import { profile } from '@/shared/config/profile'

/**
 * Sticky top bar: the brand (back to the top), a link per section, and the
 * two ways out — the printable résumé and the desktop OS this page summarises.
 */
const SiteHeader = ({ sections }) => {
  const linked = sections.filter((section) => section.nav)

  return (
    <header className="op-header">
      <div className="op-header-inner">
        <a href="#top" className="op-brand" aria-label={`${profile.name} — back to top`}>
          <span className="op-brand-mark" aria-hidden="true">K</span>
          <span className="op-brand-name">{profile.alias}</span>
        </a>

        {linked.length > 0 && (
          <nav className="op-nav" aria-label="Sections">
            {linked.map((section) => (
              <a key={section.id} href={`#${section.id}`} className="op-nav-link">{section.nav}</a>
            ))}
          </nav>
        )}

        <div className="op-header-actions">
          <a href={PATHS.resume} target="_blank" rel="noopener" className="op-btn op-btn-ghost">
            <FileText size={14} aria-hidden="true" />
            <span>Résumé</span>
          </a>
          <Link to={PATHS.desktop} className="op-btn op-btn-ghost" title="Open the desktop OS version">
            <Monitor size={14} aria-hidden="true" />
            <span>Desktop view</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default SiteHeader
