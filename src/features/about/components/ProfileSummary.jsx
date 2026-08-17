import { Mail, Phone } from 'lucide-react'
import Panel from '@/shared/components/ui/Panel'
import { profile } from '@/shared/config/profile'

/**
 * One contact method.
 *
 * An anchor rather than a `<p>`: these were previously plain text, so the
 * address and number could be read but not acted on — no tap-to-call on a
 * phone, no mail client on a click, and nothing for a keyboard to reach.
 */
const ContactLink = ({ icon: Icon, href, label, children }) => (
  <a
    href={href}
    className="os-contact-row custom-link flex items-center gap-2 text-[11px]"
    style={{ color: 'var(--os-text)' }}
    aria-label={label}
  >
    <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--os-accent)' }} aria-hidden="true" />
    <span className="truncate">{children}</span>
  </a>
)

/** Contact details — the identity itself now lives in <ProfileHero>. */
const ProfileSummary = () => (
  <Panel title="Contact">
    <div className="space-y-1">
      <ContactLink
        icon={Mail}
        href={`mailto:${profile.email}`}
        label={`Email ${profile.name}`}
      >
        {profile.email}
      </ContactLink>

      <ContactLink
        icon={Phone}
        href={`tel:${profile.phone.replace(/\s+/g, '')}`}
        label={`Call ${profile.name}`}
      >
        {profile.phone}
      </ContactLink>
    </div>
  </Panel>
)

export default ProfileSummary
