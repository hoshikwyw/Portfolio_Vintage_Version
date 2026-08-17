/**
 * Copy for the desktop helper bot.
 *
 * Lives here with the rest of the site's words (see `profile.js`) so guidance
 * is edited in one place rather than hidden inside a component.
 *
 * This replaces two earlier surfaces: the first-visit WelcomeDialog and the
 * desktop sticky note. The note picked one of its six hints at random per
 * load, so five of them were usually never read — every line survives here,
 * and the bot works through them deliberately instead.
 */

/** Shown when the panel first opens, before any suggestion. */
export const guideIntro = {
  title: 'Need a hand?',
  text: "I'm the guide for Kayv OS. This is a desktop you can actually use — open windows from the icons, the taskbar or the start menu, then drag, resize and close them.",
}

/**
 * The order the bot suggests windows in, and what it says about each.
 *
 * Keys are app ids from `@/os/config/apps`. Order matters: the bot suggests
 * the first one you have not opened yet, so this doubles as the tour route.
 */
export const windowHints = [
  {
    id: 'Home',
    text: 'Start here — who I am, where I have worked, and what I build with.',
    action: 'Open About Me',
  },
  {
    id: 'Projects',
    text: 'The things I have shipped. Use the arrows, or drag the cards sideways.',
    action: 'Open Projects',
  },
  {
    id: 'Gallery',
    text: 'Screens from my work. Click any image to blow it up full size.',
    action: 'Open Gallery',
  },
  {
    id: 'Send-Message',
    text: "A shell that only pretends to be real. Type 'help' to see what it knows, then try 'neofetch'.",
    action: 'Open Terminal',
  },
  {
    id: 'Settings',
    text: 'Three themes and six wallpapers. Light Retro is worth a look, and System follows your OS.',
    action: 'Open Settings',
  },
]

/**
 * Shown once every window has been opened — the sticky note's old hints, plus
 * the things worth knowing that are not a window.
 */
export const idleHints = [
  { text: "That is everything opened. Try right-clicking the desktop — there is a menu hiding there." },
  { text: 'Windows drag by their title bar and resize from any edge or corner. Escape closes the focused one.' },
  { text: 'Learning AI Engineering on weekends.' },
  { text: 'Currently exploring Three.js & WebGL.' },
  { text: 'This whole site is a fake OS, built with React and a lot of CSS variables.' },
  { text: 'Open to freelance work — the Hire Me button is in About Me and the start menu.', action: 'Open About Me', id: 'Home' },
]

/** localStorage key remembering that the panel has auto-opened before. */
export const GUIDE_SEEN_KEY = 'kayv-guide-seen'

/** sessionStorage key holding the ids opened so far this session. */
export const GUIDE_VISITED_KEY = 'kayv-guide-visited'
