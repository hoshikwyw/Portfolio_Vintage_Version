import { Download, Mail, MapPin } from 'lucide-react'
import { profile } from '@/shared/config/profile'
import { openHireEmail, openResume } from '@/shared/lib/browser'
import ContactCard from './ContactCard'

/**
 * Identity card at the top of the About window.
 *
 * Gives the page one focal element — portrait, name, and the actions a visitor
 * actually came for — before the detail panels below it.
 *
 * Three zones that reflow with the *window* (container queries), not the
 * screen: stacked and centred when narrow, portrait beside the text from
 * `@md`, and from `@3xl` the contact details take the right-hand column that a
 * wide window used to leave empty.
 */
const ProfileHero = () => (
  <section
    className="os-hero os-raised"
    style={{ background: 'var(--os-panel-bg)', borderRadius: 'var(--os-window-radius)' }}
  >
    {/* Title strip, echoing a window's own chrome so the card reads as OS-native. */}
    <div className="os-titlebar-strip px-3 py-1">
      <span className="text-[10px] font-bold uppercase tracking-widest">Profile</span>
    </div>

    <div className="os-hero-body">
      <img
        src={profile.avatar}
        alt={profile.alias}
        width={104}
        height={104}
        decoding="async"
        className="os-hero-avatar"
        style={{ border: 'var(--os-input-border)', background: 'var(--os-input-bg)' }}
      />

      <div className="min-w-0 text-center @md:text-left">
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

        <div className="flex flex-wrap items-center justify-center @md:justify-start gap-x-3 gap-y-1.5 mt-1.5">
          <span
            className="flex items-center gap-1 text-[10px] font-semibold tracking-wider"
            style={{ color: 'var(--os-text-secondary)' }}
          >
            <MapPin size={11} aria-hidden="true" />
            {profile.location.toUpperCase()}
          </span>

          {profile.availability && (
            <span className="os-status-pill">
              <span className="os-status-dot" aria-hidden="true" />
              {profile.availability}
            </span>
          )}
        </div>

        {/* Capped near 60 characters: on a wide window the bio otherwise ran
            the full width of the card as one hard-to-follow line. */}
        <p
          className="text-[12px] leading-relaxed mt-2.5 max-w-[60ch] mx-auto @md:mx-0"
          style={{ color: 'var(--os-text)' }}
        >
          {profile.about}
        </p>

        {/* Reuses the desktop quick-action styling, so these press like every
            other button in the OS rather than inventing a third button look.
            GitHub lives in the contact card: it is a link, not an action. */}
        <div className="flex flex-wrap justify-center @md:justify-start gap-2 mt-3">
          <button
            type="button"
            className="quick-action-btn quick-action-primary"
            onClick={() => openHireEmail()}
          >
            <Mail size={12} aria-hidden="true" />
            Hire Me
          </button>

          <button type="button" className="quick-action-btn" onClick={openResume}>
            <Download size={12} aria-hidden="true" />
            Resume
          </button>
        </div>
      </div>

      <ContactCard />
    </div>
  </section>
)

export default ProfileHero
