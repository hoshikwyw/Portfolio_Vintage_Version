import { profile, skills, languages, interests } from '@/config/profile'

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

const SeoContent = () => (
  <div aria-hidden="true" style={visuallyHidden}>
    <h1>{profile.name} — Frontend Developer Portfolio</h1>
    <p>
      Hi! I'm {profile.alias} — a creative frontend developer from {profile.location} who loves
      crafting smooth UIs with React and Tailwind. I'm always excited to learn something new.
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
    <ul>
      <li>Junior Frontend Developer at IT-Wizard since November 2024</li>
      <li>Freelance Projects — Portfolio, Booking App, AI Assistant UI</li>
    </ul>
    <h2>Education</h2>
    <ul>
      <li>Frontend Web Developer — MMS-IT</li>
      <li>Self-taught Frontend Development: React, Tailwind CSS, Next.js, React Native, TypeScript</li>
    </ul>
    <h2>Interests</h2>
    <p>{interests.join(', ')}</p>
    <h2>Languages</h2>
    <p>{languages.join(', ')}</p>
  </div>
)

export default SeoContent
