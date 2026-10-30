import { AppWindow, BookOpen, Globe, Languages, Smartphone, Wrench } from 'lucide-react'
import { currently, languages, platforms, skills, tools } from '@/shared/config/profile'
import SectionHeading from '../components/SectionHeading'

/**
 * An icon for each kind of app, matched on its name so the data in
 * `profile.js` stays plain text. Anything unrecognised gets the web globe.
 */
const platformIcon = (name) => {
  if (/native|mobile/i.test(name)) return Smartphone
  if (/pwa|hybrid/i.test(name)) return AppWindow
  return Globe
}

const PlatformCard = ({ name, tag }) => {
  const Icon = platformIcon(name)
  return (
    <li className="op-card op-platform">
      <span className="op-platform-icon" aria-hidden="true"><Icon size={22} /></span>
      <p className="op-platform-name">{name}</p>
      <p className="op-platform-tag">{tag}</p>
    </li>
  )
}

/** Self-rated levels as plain bars — the OS's segmented meters, simplified. */
const SkillMeter = ({ name, level }) => (
  <li className="op-meter-row">
    <span className="op-meter-name">{name}</span>
    <span
      className="op-meter"
      role="progressbar"
      aria-label={name}
      aria-valuenow={level}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span className="op-meter-fill" style={{ width: `${level}%` }} />
    </span>
    <span className="op-meter-level" aria-hidden="true">{level}%</span>
  </li>
)

/** `{ name, tag }` rows with an icon heading — Currently and Languages. */
const PairCard = ({ icon: Icon, title, items }) => (
  <div className="op-card">
    <h3 className="op-card-title">
      <Icon size={16} aria-hidden="true" />
      {title}
    </h3>
    <ul className="op-pairs">
      {items.map(({ name, tag }) => (
        <li key={name}>
          <span className="op-pair-name">{name}</span>
          <span className="op-pair-tag">{tag}</span>
        </li>
      ))}
    </ul>
  </div>
)

/**
 * What Kayv builds, how well, and with what: platforms first (the headline),
 * then core-skill meters beside the toolbox, then what is being learned now
 * and the languages spoken.
 */
const SkillsSection = ({ id }) => (
  <section id={id} className="op-section op-section-alt" aria-labelledby={`${id}-title`}>
    <div className="op-container">
      <SectionHeading
        id={`${id}-title`}
        index="02"
        label="Skills"
        title="What I build, and with what"
        intro="Web, PWA and native mobile apps — from the interface to the APIs and data behind it."
      />

      <ul className="op-platforms" aria-label="What I build">
        {platforms.map((platform) => <PlatformCard key={platform.name} {...platform} />)}
      </ul>

      <div className="op-two-col op-gap-top">
        <div className="op-card">
          <h3 className="op-card-title">Core skills</h3>
          <ul className="op-meters">
            {skills.map((skill) => <SkillMeter key={skill.name} {...skill} />)}
          </ul>
        </div>

        <div className="op-card">
          <h3 className="op-card-title">
            <Wrench size={16} aria-hidden="true" />
            Tools & services
          </h3>
          <dl className="op-tools">
            {tools.map(({ name, tag }) => (
              <div key={name} className="op-tool-group">
                <dt>{name}</dt>
                <dd>
                  <ul className="op-chips">
                    {tag.split(' · ').map((tool) => <li key={tool} className="op-chip">{tool}</li>)}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="op-two-col op-gap-top">
        <PairCard icon={BookOpen} title="Currently" items={currently} />
        <PairCard icon={Languages} title="Languages" items={languages.map(({ name, level }) => ({ name, tag: level }))} />
      </div>
    </div>
  </section>
)

export default SkillsSection
