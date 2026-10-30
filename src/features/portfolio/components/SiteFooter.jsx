import { Link } from 'react-router-dom'
import { ArrowUp, Monitor } from 'lucide-react'
import { PATHS } from '@/shared/config/paths'
import { profile } from '@/shared/config/profile'

/** Sign-off, a pointer to the desktop version, and a way back up. */
const SiteFooter = () => (
  <footer className="op-footer">
    <div className="op-container op-footer-inner">
      <p className="op-footer-copy">
        © {new Date().getFullYear()} {profile.name}. Built with React.
      </p>
      <div className="op-footer-links">
        <Link to={PATHS.desktop} className="op-footer-link">
          <Monitor size={14} aria-hidden="true" />
          Try the desktop version
        </Link>
        <a href="#top" className="op-footer-link">
          <ArrowUp size={14} aria-hidden="true" />
          Back to top
        </a>
      </div>
    </div>
  </footer>
)

export default SiteFooter
