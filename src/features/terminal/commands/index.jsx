import { profile, system, terminalSkills } from '@/shared/config/profile'
import { Alert, Cmd, Dim, Green, Path, Plain } from '@/features/terminal/components/TerminalText'

const NEOFETCH_LOGO = `  ╔══════╗
  ║  K   ║
  ║  OS  ║
  ╚══════╝`

const cowsay = (message) => {
  const border = '─'.repeat(message.length + 2)
  return `
 ┌${border}┐
 │ ${message} │
 └${border}┘
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`
}

/**
 * Every terminal command, keyed by the exact input that triggers it.
 *
 * Each entry is `{ help, aliases?, run(ctx) }` where `run` returns the node to
 * print (or nothing). `help` doubles as the description in `help` output, so
 * the listing can never drift from what is actually implemented — it used to be
 * a hand-maintained block inside a 150-line switch.
 *
 * `ctx` carries `{ input, projects, clear }`.
 */
const commands = {
  help: {
    help: 'Show this help message',
    run: () => (
      <>
        <Cmd>Available commands:</Cmd><br />
        {listedCommands().map(([name, { help }]) => (
          <span key={name}>{'  '}<Cmd>{name}</Cmd> — {help}<br /></span>
        ))}
      </>
    ),
  },

  about: {
    help: 'Learn about me',
    run: () => (
      <>
        <Green>Hello! I'm a full stack developer. I work on:</Green><br />
        {'  '}- React front ends that feel smooth and responsive<br />
        {'  '}- The APIs and data behind them<br />
        {'  '}- Interactive animations with GSAP<br />
        <Green>Studying CS at UoPeople, learning Python, building with Claude.</Green>
      </>
    ),
  },

  projects: {
    help: 'List my projects',
    aliases: ['list projects'],
    run: ({ projects }) => {
      const live = projects?.filter((p) => p.status !== false) ?? []
      if (!live.length) return 'No projects available.'

      return (
        <>
          <Green>My projects:</Green>
          {live.map((project, i) => {
            const line = `${i + 1}. ${project.title}${project.description ? ` — ${project.description}` : ''}`

            // The demo URL is optional; without one this is a line, not a
            // link that goes nowhere.
            return (
              <div key={project.id}>
                {project.demo_url ? (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noreferrer"
                    className="os-terminal-link underline decoration-dotted"
                  >
                    {line}
                  </a>
                ) : (
                  <Dim>{line}</Dim>
                )}
              </div>
            )
          })}
        </>
      )
    },
  },

  skills: {
    help: 'List my skills',
    aliases: ['list skills'],
    run: () => (
      <>
        <Green>My skills:</Green><br />
        {terminalSkills.map((skill, i) => (
          <span key={skill}>{i > 0 && ' · '}<Green>{skill}</Green></span>
        ))}
      </>
    ),
  },

  neofetch: {
    help: 'System info',
    run: () => (
      <>
        <pre className="leading-tight" style={{ color: 'var(--os-terminal-path)' }}>{NEOFETCH_LOGO}</pre>
        <Cmd>{profile.alias.toLowerCase()}@os</Cmd><br />
        {'  '}OS: {system.name} v{system.version}<br />
        {'  '}Shell: kayv-terminal<br />
        {'  '}Stack: {system.builtWith}<br />
        {'  '}Theme: Vintage Retro<br />
        {'  '}Resolution: {window.innerWidth}x{window.innerHeight}<br />
        {'  '}Uptime: since you opened this tab<br />
        {'  '}Developer: {profile.name}<br />
        {'  '}Studying: Computer Science @ UoPeople<br />
        {'  '}Learning: Python<br />
        {'  '}Pair programmer: Claude
      </>
    ),
  },

  whoami: {
    help: 'Who am I?',
    run: () => (
      <Green>
        {profile.alias.toLowerCase()} — {profile.role} from {profile.location}. Loves React, vintage UIs, and 2D games.
      </Green>
    ),
  },

  cowsay: {
    help: 'Moo!',
    run: ({ input }) => {
      const argument = input.slice('cowsay'.length).trim()
      return (
        <pre className="leading-tight" style={{ color: 'var(--os-terminal-plain)' }}>
          {cowsay(argument || 'Moo! Hire Kayv!')}
        </pre>
      )
    },
  },

  date: {
    help: 'Current date',
    run: () => <Plain>{new Date().toString()}</Plain>,
  },

  clear: {
    help: 'Clear the terminal',
    run: ({ clear }) => clear(),
  },

  ls: {
    hidden: true,
    help: 'List files',
    run: () => (
      <>
        <Path>about.txt</Path>{'  '}
        <Green>projects/</Green>{'  '}
        <Path>resume.pdf</Path>{'  '}
        <Green>gallery/</Green>{'  '}
        <Path>README.md</Path>
      </>
    ),
  },

  'cat about.txt': {
    hidden: true,
    help: 'Read the about file',
    aliases: ['cat readme.md'],
    run: () => (
      <Plain>
        Hi! I'm {profile.alias}, a {profile.role.toLowerCase()} from {profile.location.split(',')[0]}. I
        build web apps end to end with React, Tailwind, and a love for vintage aesthetics — and I'm
        studying Computer Science at UoPeople while learning Python. This entire portfolio is a fake
        desktop OS — how cool is that?
      </Plain>
    ),
  },

  sudo: {
    hidden: true,
    help: 'Nice try',
    aliases: ['sudo rm -rf /', 'rm -rf /'],
    run: () => <Alert>Nice try. 😏</Alert>,
  },

  exit: {
    hidden: true,
    help: 'Leave (you cannot)',
    run: () => <Dim>There is no escape. You're stuck in Kayv OS forever.</Dim>,
  },
}

/** Commands advertised by `help` — the easter eggs stay hidden. */
const listedCommands = () => Object.entries(commands).filter(([, cmd]) => !cmd.hidden)

/** Resolve an input line to a command, honouring aliases and `cowsay <text>`. */
export const resolveCommand = (input) => {
  const normalized = input.toLowerCase().trim()
  if (!normalized) return null

  if (commands[normalized]) return commands[normalized]

  const aliased = Object.values(commands).find((cmd) => cmd.aliases?.includes(normalized))
  if (aliased) return aliased

  // Commands that accept a free-text argument, e.g. `cowsay hello world`.
  const [verb] = normalized.split(' ')
  if (verb === 'cowsay') return commands.cowsay

  return null
}

export const unknownCommand = (input) => (
  <>
    <Alert>Command not found: '{input}'</Alert><br />
    <Dim>Type '<Cmd>help</Cmd>' for available commands</Dim>
  </>
)

export const welcomeMessage = (
  <Dim>
    Type '<Cmd>help</Cmd>' to see available commands
  </Dim>
)

export default commands
