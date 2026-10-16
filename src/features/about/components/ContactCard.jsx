import { useEffect, useState } from 'react'
import { Check, Copy, Github, Mail, Phone } from 'lucide-react'
import { profile } from '@/shared/config/profile'

/** How long the "copied" tick shows before reverting to the copy icon. */
const COPIED_MS = 1800

/**
 * Copy the email address to the clipboard.
 *
 * The fallback for Hire Me: a `mailto:` link does nothing for a visitor with
 * no mail app configured — common on a work machine or a shared computer — so
 * the address must be easy to take elsewhere.
 */
const CopyEmail = () => {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), COPIED_MS)
    return () => clearTimeout(timer)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
    } catch {
      // Clipboard blocked (insecure context, denied permission): the address
      // is still on screen to select by hand.
    }
  }

  return (
    <>
      <button
        type="button"
        className="os-contact-copy"
        onClick={copy}
        aria-label="Copy email address"
        title={copied ? 'Copied' : 'Copy email address'}
      >
        {copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
      </button>
      <span role="status" className="sr-only">{copied ? 'Email address copied' : ''}</span>
    </>
  )
}

/**
 * One contact method.
 *
 * An anchor rather than a `<p>`, so the address and number can be acted on —
 * tap-to-call on a phone, a mail client on a click, and something a keyboard
 * can reach.
 */
const ContactLink = ({ icon: Icon, href, label, external = false, children }) => (
  <a
    href={href}
    className="os-contact-row custom-link"
    aria-label={label}
    {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
  >
    <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--os-accent)' }} aria-hidden="true" />
    <span className="truncate">{children}</span>
  </a>
)

/**
 * Email, phone and GitHub, set into the profile card.
 *
 * This used to be its own "Contact" panel holding two lines, which spent a
 * whole section of the page on very little. Inside the hero it fills the
 * space a wide window otherwise left empty beside the bio, and on a narrow one
 * it drops under the buttons.
 */
const ContactCard = () => (
  <div className="os-contact-card">
    <p className="os-contact-heading">Contact</p>
    <div className="os-contact-line">
      <ContactLink icon={Mail} href={`mailto:${profile.email}`} label={`Email ${profile.name}`}>
        {profile.email}
      </ContactLink>
      <CopyEmail />
    </div>
    <ContactLink
      icon={Phone}
      href={`tel:${profile.phone.replace(/\s+/g, '')}`}
      label={`Call ${profile.name}`}
    >
      {profile.phone}
    </ContactLink>
    <ContactLink icon={Github} href={profile.github} label={`${profile.name} on GitHub`} external>
      {profile.github.replace(/^https?:\/\//, '')}
    </ContactLink>
  </div>
)

export default ContactCard
