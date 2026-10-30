import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Menu, Monitor, X } from 'lucide-react'
import { PATHS } from '@/shared/config/paths'
import { profile } from '@/shared/config/profile'
import { useOutsideClick } from '@/shared/hooks/useOutsideClick'
import { useActiveSection } from '../hooks/useActiveSection'

/**
 * Sticky top bar: the brand (back to the top), a link per section, and the
 * two ways out — the printable résumé and the desktop OS this page summarises.
 *
 * The link for the section being read is highlighted as the page scrolls. On
 * a phone the links fold into a menu that drops down under the bar.
 */
const SiteHeader = ({ sections }) => {
  const linked = sections.filter((section) => section.nav)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef(null)
  const headerRef = useOutsideClick(() => setMenuOpen(false), menuOpen)
  const active = useActiveSection(headerRef, linked.map((section) => section.id))

  useEffect(() => {
    if (!menuOpen) return undefined
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return
      setMenuOpen(false)
      menuButtonRef.current?.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  return (
    <header ref={headerRef} className="op-header">
      <div className="op-header-inner">
        <a href="#top" className="op-brand" aria-label={`${profile.name} — back to top`}>
          <span className="op-brand-mark" aria-hidden="true">K</span>
          <span className="op-brand-name">{profile.alias}</span>
        </a>

        {linked.length > 0 && (
          <nav id="op-nav" className="op-nav" aria-label="Sections" data-open={menuOpen || undefined}>
            {linked.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="op-nav-link"
                aria-current={active === section.id ? 'location' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {section.nav}
              </a>
            ))}
          </nav>
        )}

        <div className="op-header-actions">
          <a href={PATHS.resume} target="_blank" rel="noopener" className="op-btn op-btn-ghost" aria-label="Résumé (opens in a new tab)">
            <FileText size={14} aria-hidden="true" />
            <span>Résumé</span>
          </a>
          <Link to={PATHS.desktop} className="op-btn op-btn-ghost" aria-label="Desktop view" title="Open the desktop OS version">
            <Monitor size={14} aria-hidden="true" />
            <span>Desktop view</span>
          </Link>
          {linked.length > 0 && (
            <button
              ref={menuButtonRef}
              type="button"
              className="op-icon-btn op-menu-btn"
              aria-label="Sections menu"
              aria-expanded={menuOpen}
              aria-controls="op-nav"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default SiteHeader
