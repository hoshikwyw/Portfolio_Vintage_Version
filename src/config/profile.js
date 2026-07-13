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
  role: 'Frontend Developer',
  location: 'Yangon, Myanmar',

  email: 'khaingwutyiwin1712@gmail.com',
  phone: '+959795847089',

  avatar: '/myPf.png',
  resume: '/KhaingWutYiWinResume.pdf',
  github: 'https://github.com/hoshikwyw',

  about:
    "Hi! I'm Kayv — a creative frontend developer who loves crafting smooth UIs with React and Tailwind. I'm always excited to learn something new.",
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

export const education = [
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

export const languages = ['English — Intermediate', 'Burmese — Native']

export const interests = ['Design', 'Animation', 'AI', 'Vintage UI', '2D Games']

/** Metadata for the "About" panel in Settings and the terminal `neofetch`. */
export const system = {
  name: 'Kayv OS',
  version: '1.0.0',
  builtWith: 'React + Vite + Tailwind',
}
