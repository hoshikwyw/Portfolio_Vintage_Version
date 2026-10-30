import { FileText, Github, Mail, MapPin } from 'lucide-react'
import { profile, summary } from '@/shared/config/profile'
import { PATHS } from '@/shared/config/paths'
import { openHireEmail } from '@/shared/lib/browser'

/**
 * The first screen: who, what, where, and the three things a visitor most
 * likely came to do — get in touch, read the résumé, see the code.
 */
const HeroSection = ({ id }) => (
  <section id={id} className="op-hero" aria-labelledby="op-hero-name">
    <div className="op-container op-hero-grid">
      <div className="op-hero-text">
        <p className="op-eyebrow">Hi, I&apos;m {profile.alias}</p>
        <h1 id="op-hero-name" className="op-hero-name">{profile.name}</h1>
        <p className="op-hero-role">{profile.role}</p>

        <div className="op-hero-meta">
          <span className="op-meta-item">
            <MapPin size={14} aria-hidden="true" />
            {profile.location}
          </span>
          {profile.availability && (
            <span className="op-pill">
              <span className="op-pill-dot" aria-hidden="true" />
              {profile.availability}
            </span>
          )}
        </div>

        {/* The bio without its greeting — the eyebrow already says hello. */}
        <p className="op-hero-bio">{summary}</p>

        <div className="op-hero-actions">
          <button type="button" className="op-btn op-btn-primary" onClick={() => openHireEmail()}>
            <Mail size={15} aria-hidden="true" />
            Hire me
          </button>
          <a href={PATHS.resume} target="_blank" rel="noopener" className="op-btn">
            <FileText size={15} aria-hidden="true" />
            Résumé
          </a>
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="op-btn">
            <Github size={15} aria-hidden="true" />
            GitHub
          </a>
        </div>
      </div>

      <div className="op-hero-photo-wrap">
        <img
          src={profile.avatar}
          alt={`Portrait of ${profile.name}`}
          width={600}
          height={800}
          className="op-hero-photo"
          decoding="async"
          fetchPriority="high"
        />
      </div>
    </div>
  </section>
)

export default HeroSection
