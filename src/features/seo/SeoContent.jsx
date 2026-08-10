import { education, experience, interests, languages, profile, skills } from '@/shared/config/profile'

// Visually hidden but crawlable copy — gives search engines real text to
// index, since the desktop UI itself is mostly canvas/absolute layers.
const visuallyHidden = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  whiteSpace: 'nowrap',
  border: 0,
}

const TimelineList = ({ items }) => (
  <ul>
    {items.map((item) => (
      <li key={item.title}>{item.title} — {item.detail}</li>
    ))}
  </ul>
)

/**
 * Screen-reader / crawler copy for the portfolio.
 *
 * Everything here is rendered from `shared/config/profile` rather than
 * re-typed: the experience and education entries used to be hardcoded here as
 * well, so editing the profile silently left the indexed copy stale.
 */
const SeoContent = () => (
  <div aria-hidden="true" style={visuallyHidden}>
    <h1>{profile.name} — {profile.role} Portfolio</h1>
    <p>
      Hi! I'm {profile.alias} — {profile.about}
    </p>

    <h2>Contact</h2>
    <p>Email: {profile.email}</p>
    <p>Phone: {profile.phone}</p>
    <p>Location: {profile.location}</p>

    <h2>Skills</h2>
    <ul>
      {skills.map((skill) => (
        <li key={skill.name}>{skill.name} — {skill.level}%</li>
      ))}
    </ul>

    <h2>Experience</h2>
    <TimelineList items={experience} />

    <h2>Education</h2>
    <TimelineList items={education} />

    <h2>Interests</h2>
    <p>{interests.join(', ')}</p>

    <h2>Languages</h2>
    <p>{languages.join(', ')}</p>
  </div>
)

export default SeoContent
