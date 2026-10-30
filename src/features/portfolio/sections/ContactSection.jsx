import { useEffect, useState } from 'react'
import { Check, Copy, Github, Mail, MapPin, Phone } from 'lucide-react'
import { profile } from '@/shared/config/profile'
import { openHireEmail } from '@/shared/lib/browser'
import SectionHeading from '../components/SectionHeading'

/**
 * Copies the email address. A `mailto:` link does nothing for a visitor with
 * no mail app set up (common on work laptops), so the address itself has to
 * be one click away too.
 */
const CopyEmailButton = () => {
  const [status, setStatus] = useState('idle') // 'idle' | 'copied' | 'failed'

  useEffect(() => {
    if (status === 'idle') return undefined
    const timer = setTimeout(() => setStatus('idle'), 2500)
    return () => clearTimeout(timer)
  }, [status])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setStatus('copied')
    } catch {
      setStatus('failed')
    }
  }

  return (
    <>
      <button type="button" className="op-btn" onClick={copy}>
        {status === 'copied' ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
        {status === 'copied' ? 'Copied' : 'Copy email'}
      </button>
      {/* Announced to screen readers; the button's own label change is not. */}
      <span role="status" className="op-sr-only">
        {status === 'copied' && 'Email address copied'}
        {status === 'failed' && `Could not copy. The address is ${profile.email}`}
      </span>
    </>
  )
}

const CHANNELS = [
  { key: 'email', Icon: Mail, label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
  { key: 'phone', Icon: Phone, label: 'Phone', value: profile.phone, href: `tel:${profile.phone}` },
  { key: 'github', Icon: Github, label: 'GitHub', value: profile.github.replace(/^https?:\/\//, ''), href: profile.github, external: true },
  { key: 'location', Icon: MapPin, label: 'Based in', value: profile.location },
]

/** The last stop: ways to get in touch, with email front and centre. */
const ContactSection = ({ id }) => (
  <section id={id} className="op-section op-section-alt" aria-labelledby={`${id}-title`}>
    <div className="op-container">
      <SectionHeading
        id={`${id}-title`}
        index="04"
        label="Contact"
        title="Let's build something together"
        intro={`${profile.availability ? `${profile.availability}. ` : ''}Email is the quickest way to reach me.`}
      />

      <div className="op-contact">
        <div className="op-card op-contact-cta">
          <h3 className="op-contact-cta-title">Have a project or a role in mind?</h3>
          <p className="op-contact-cta-text">
            Tell me a little about it and I&apos;ll get back to you.
          </p>
          <div className="op-contact-actions">
            <button type="button" className="op-btn op-btn-primary" onClick={() => openHireEmail()}>
              <Mail size={15} aria-hidden="true" />
              Email me
            </button>
            <CopyEmailButton />
          </div>
        </div>

        <ul className="op-card op-channels" aria-label="Contact details">
          {CHANNELS.map(({ key, Icon, label, value, href, external }) => (
            <li key={key} className="op-channel">
              <span className="op-channel-icon" aria-hidden="true"><Icon size={18} /></span>
              <span className="op-channel-text">
                <span className="op-channel-label">{label}</span>
                {href ? (
                  <a
                    href={href}
                    className="op-channel-value"
                    {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
                  >
                    {value}
                  </a>
                ) : (
                  <span className="op-channel-value">{value}</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
)

export default ContactSection
