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
  /** The generated résumé page (`features/resume`), built from this file. */
  resume: '/resume',
  github: 'https://github.com/hoshikwyw',

  about:
    "Hi! I'm Kayv — a mid-level full stack developer at IT-Wizard, building web and mobile apps end to end: React and Next.js on the web, PWAs with Capacitor, and native apps with React Native and Expo. I'm studying Computer Science at the University of the People, learning Python, and building with Claude as my AI pair programmer.",

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

/**
 * The kinds of app Kayv ships, shown as the "Builds" panel in About Me.
 * Platforms rather than skill bars: they describe what gets made, not a
 * self-rated level.
 */
export const platforms = [
  { name: 'Web apps', tag: 'React · Next.js' },
  { name: 'PWAs & hybrid apps', tag: 'Capacitor' },
  { name: 'Native mobile apps', tag: 'React Native · Expo' },
]

/**
 * Tools and services, grouped by what they are for — the "Tools" panel in
 * About Me and the terminal `tools` command.
 */
export const tools = [
  { name: 'Version control', tag: 'Git · GitHub' },
  { name: 'Backend & databases', tag: 'Supabase · DBeaver' },
  { name: 'Cloud & DevOps', tag: 'AWS · Docker' },
  { name: 'APIs', tag: 'Google Vision · Maps' },
]

export const education = [
  { title: 'Computer Science', detail: 'University of the People (UoPeople) — in progress' },
  { title: 'Frontend Web Developer', detail: 'MMS-IT' },
  {
    title: 'Self-taught Frontend Development',
    detail: 'React, Tailwind CSS, Next.js, React Native, Typescript',
  },
]

/** Newest first. The junior role stays as history — the promotion is the story. */
export const experience = [
  { title: 'Mid-level Full Stack Developer', detail: 'IT-Wizard · since August 2026' },
  { title: 'Junior Frontend Developer', detail: 'IT-Wizard · November 2024 – August 2026' },
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
