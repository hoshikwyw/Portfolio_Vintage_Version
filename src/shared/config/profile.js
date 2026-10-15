/**
 * Single source of truth for all personal / portfolio content.
 *
 * Anything that describes *who Kayv is* lives here — name, contact details,
 * skills, timeline, résumé path — so copy is edited in one place instead of
 * being hunted down across a dozen components.
 */

export const profile = {
  name: 'Khaing Wut Yi Win',
  alias: 'Kayv',
  role: 'Full Stack Developer',
  location: 'Yangon, Myanmar',

  email: 'khaingwutyiwin1712@gmail.com',
  phone: '+959795847089',

  avatar: '/myPf.png',
  resume: '/KhaingWutYiWinResume.pdf',
  github: 'https://github.com/hoshikwyw',

  about:
    "Hi! I'm Kayv — a full stack developer who builds web apps end to end, from smooth React interfaces to the APIs and data behind them. I'm studying Computer Science at the University of the People, learning Python, and building with Claude as my AI pair programmer.",

  /** Status shown beside the role in About Me. Set to null to hide it. */
  availability: 'Open to freelance work',
}

/** Skills rendered as progress bars in the About window. */
export const skills = [
  { name: 'React.js', level: 90 },
  { name: 'Tailwind CSS', level: 85 },
  { name: 'Next.js', level: 75 },
  { name: 'JavaScript', level: 90 },
  { name: 'TypeScript', level: 70 },
]

/** Short skill list surfaced by the terminal `skills` command. */
export const terminalSkills = ['React', 'Tailwind', 'GSAP', 'Node']

/**
 * What Kayv is working on right now, shown as the "Currently" panel in About
 * Me. Kept apart from `skills`: those carry a self-rated level, and something
 * still being learned should not have to pretend to one.
 */
export const currently = [
  { name: 'Computer Science', tag: 'Studying · UoPeople' },
  { name: 'Python', tag: 'Learning' },
  { name: 'Claude', tag: 'AI pair programmer' },
]

export const education = [
  { title: 'Computer Science', detail: 'University of the People (UoPeople) — in progress' },
  { title: 'Frontend Web Developer', detail: 'MMS-IT' },
  {
    title: 'Self-taught Frontend Development',
    detail: 'React, Tailwind CSS, Next.js, React Native, Typescript',
  },
]

export const experience = [
  { title: 'Junior Frontend Developer', detail: 'IT-Wizard since 2024 November' },
  { title: 'Freelance Projects', detail: 'Portfolio, Booking App, AI Assistant UI' },
]

export const languages = [
  { name: 'English', level: 'Intermediate' },
  { name: 'Burmese', level: 'Native' },
]

export const interests = ['Design', 'Animation', 'AI', 'Vintage UI', '2D Games']

/** Metadata for the "About" panel in Settings and the terminal `neofetch`. */
export const system = {
  name: 'Kayv OS',
  version: '1.0.0',
  builtWith: 'React + Vite + Tailwind',
}
