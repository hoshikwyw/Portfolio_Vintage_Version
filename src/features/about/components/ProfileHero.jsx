import { Download, Github, Mail, MapPin } from 'lucide-react'
import { profile } from '@/shared/config/profile'
import { downloadResume, openHireEmail } from '@/shared/lib/browser'

/**
 * Identity card at the top of the About window.
 *
 * The window previously opened onto six near-identical beveled panels, so
 * nothing read as the starting point. This gives the page one focal element —
 * portrait, name, and the two actions a visitor actually came for — before the
 * detail panels below it.
 */
const ProfileHero = () => (
  <section
    className="os-hero"
    style={{
      background: 'var(--os-panel-bg)',
      border: '2px solid var(--os-border-dark)',
      borderTopColor: 'var(--os-border-light)',
      borderLeftColor: 'var(--os-border-light)',
      borderRadius: 'var(--os-window-radius)',
    }}
  >
    {/* Title strip, echoing a window's own chrome so the card reads as OS-native. */}
    <div
      className="px-3 py-1"
      style={{
        background: 'var(--os-titlebar)',
        borderRadius: 'calc(var(--os-window-radius) - 2px) calc(var(--os-window-radius) - 2px) 0 0',
      }}
    >
      <span
        className="text-[10px] font-bold uppercase tracking-widest"
        style={{ color: 'var(--os-titlebar-text)' }}
      >
        Profile
      </span>
    </div>

    <div className="flex flex-col @md:flex-row items-center @md:items-start gap-4 p-4">
      <img
        src={profile.avatar}
        alt={profile.alias}
        width={104}
        height={104}
        decoding="async"
        className="os-hero-avatar flex-shrink-0"
        style={{ border: 'var(--os-input-border)', background: 'var(--os-input-bg)' }}
      />

      <div className="flex-1 min-w-0 text-center @md:text-left">
        <h1
          className="text-lg @md:text-xl font-bold tracking-wide uppercase leading-tight"
          style={{ color: 'var(--os-text)' }}
        >
          {profile.name}
        </h1>

        <p
          className="text-[11px] font-bold uppercase tracking-[0.15em] mt-0.5"
          style={{ color: 'var(--os-accent)' }}
        >
          {profile.role}
        </p>

        <p
          className="flex items-center justify-center @md:justify-start gap-1 text-[10px] font-semibold tracking-wider mt-1"
          style={{ color: 'var(--os-text-secondary)' }}
        >
          <MapPin size={11} aria-hidden="true" />
          {profile.location.toUpperCase()}
        </p>

        <p
          className="text-[12px] leading-relaxed mt-2.5"
          style={{ color: 'var(--os-text)' }}
        >
          {profile.about}
        </p>

        {/* Reuses the desktop quick-action styling, so these press like every
            other button in the OS rather than inventing a third button look. */}
        <div className="flex flex-wrap justify-center @md:justify-start gap-2 mt-3">
          <button
            type="button"
            className="quick-action-btn quick-action-primary"
            onClick={() => openHireEmail({ subject: 'Hire Request' })}
          >
            <Mail size={12} aria-hidden="true" />
            Hire Me
          </button>

          <button type="button" className="quick-action-btn" onClick={downloadResume}>
            <Download size={12} aria-hidden="true" />
            Resume
          </button>

          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="quick-action-btn custom-link"
          >
            <Github size={12} aria-hidden="true" />
            GitHub
          </a>
        </div>
      </div>
    </div>
  </section>
)

export default ProfileHero
