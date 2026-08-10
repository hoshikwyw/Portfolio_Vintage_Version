import { useState, useRef, useEffect } from 'react'
import { useProjects } from '@/hooks/useProjects'
import { MONO_STACK } from '@/shared/constants/fonts'
import { profile, terminalSkills, system } from '@/shared/config/profile'

const Cmd = ({ children }) => <span className="text-[#a0d0a0] font-bold">{children}</span>

const initialMessage = (
  <span className="text-[#6a8a6a]">
    Type '<span className="text-[#a0d0a0] font-bold">help</span>' to see available commands
  </span>
)

/**
 * CRT-styled fake shell. Commands are resolved synchronously from local data
 * (projects come from React Query); there is no real backend.
 */
const Terminal = () => {
  const [history, setHistory] = useState([initialMessage])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef(null)
  const historyEndRef = useRef(null)

  const { data: projects } = useProjects()

  useEffect(() => {
    inputRef.current?.focus()
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, isLoading])

  const addLine = (line) => setHistory((h) => [...h, line])
  const clearTerminal = () => setHistory([initialMessage])

  const execCommand = async (cmd) => {
    const lower = cmd.toLowerCase().trim()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 400))

    try {
      switch (lower) {
        case '':
          break
        case 'help':
          addLine(
            <>
              <span className="text-[#a0d0a0] font-bold">Available commands:</span><br />
              {'  '}<Cmd>help</Cmd> — Show this help message<br />
              {'  '}<Cmd>about</Cmd> — Learn about me<br />
              {'  '}<Cmd>projects</Cmd> — List my projects<br />
              {'  '}<Cmd>skills</Cmd> — List my skills<br />
              {'  '}<Cmd>neofetch</Cmd> — System info<br />
              {'  '}<Cmd>whoami</Cmd> — Who am I?<br />
              {'  '}<Cmd>cowsay</Cmd> — Moo!<br />
              {'  '}<Cmd>date</Cmd> — Current date<br />
              {'  '}<Cmd>clear</Cmd> — Clear the terminal
            </>,
          )
          break
        case 'about':
          addLine(
            <>
              <span className="text-[#a0d0a0]">Hello! I'm a front-end developer specializing in:</span><br />
              {'  '}- React.js development<br />
              {'  '}- Interactive animations with GSAP<br />
              {'  '}- User-friendly responsive web apps<br />
              <span className="text-[#a0d0a0]">I love building engaging web experiences!</span>
            </>,
          )
          break
        case 'projects':
        case 'list projects': {
          const visibleProjects = projects?.filter((p) => p.status !== false) || []
          if (!visibleProjects.length) {
            addLine('No projects available.')
          } else {
            addLine(<span className="text-[#a0d0a0]">My projects:</span>)
            visibleProjects.forEach((p, i) => {
              addLine(
                <a
                  key={i}
                  href={p.demo_url}
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-dotted hover:text-[#a0d0a0] text-[#6a8a6a]"
                >
                  {`${i + 1}. ${p.title}`} - {p.description || 'Check it out!'}
                </a>,
              )
            })
          }
          break
        }
        case 'skills':
        case 'list skills':
          addLine(
            <>
              <span className="text-[#a0d0a0]">My skills:</span><br />
              {terminalSkills.map((skill, i) => (
                <span key={i}>{i > 0 && ' · '}<span className="text-[#a0d0a0]">{skill}</span></span>
              ))}
            </>,
          )
          break
        case 'whoami':
          addLine(
            <span className="text-[#a0d0a0]">
              {profile.alias.toLowerCase()} — {profile.role} from {profile.location}. Loves React, vintage UIs, and 2D games.
            </span>,
          )
          break
        case 'neofetch': {
          const ascii = `  ╔══════╗
  ║  K   ║
  ║  OS  ║
  ╚══════╝`
          addLine(<pre className="text-[#6a6aaa] leading-tight">{ascii}</pre>)
          addLine(
            <>
              <span className="text-[#a0d0a0] font-bold">{profile.alias.toLowerCase()}@os</span><br />
              {'  '}OS: {system.name} v{system.version}<br />
              {'  '}Shell: kayv-terminal<br />
              {'  '}Stack: React 19 + Vite + Tailwind<br />
              {'  '}Theme: Vintage Retro<br />
              {'  '}Resolution: {window.innerWidth}x{window.innerHeight}<br />
              {'  '}Uptime: since you opened this tab<br />
              {'  '}Developer: {profile.name}
            </>,
          )
          break
        }
        case 'date':
          addLine(<span className="text-[#e0d8c8]">{new Date().toString()}</span>)
          break
        case 'cowsay':
        case 'cowsay hello': {
          const msg = lower === 'cowsay' ? 'Moo! Hire Kayv!' : cmd.slice(7) || 'Moo!'
          const line = '─'.repeat(msg.length + 2)
          addLine(
            <pre className="text-[#e0d8c8] leading-tight">{`
 ┌${line}┐
 │ ${msg} │
 └${line}┘
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`}
            </pre>,
          )
          break
        }
        case 'ls':
          addLine(
            <>
              <span className="text-[#6a6aaa]">about.txt</span>{'  '}
              <span className="text-[#a0d0a0]">projects/</span>{'  '}
              <span className="text-[#6a6aaa]">resume.pdf</span>{'  '}
              <span className="text-[#a0d0a0]">gallery/</span>{'  '}
              <span className="text-[#6a6aaa]">README.md</span>
            </>,
          )
          break
        case 'cat readme.md':
        case 'cat about.txt':
          addLine(
            <span className="text-[#e0d8c8]">
              Hi! I'm Kayv, a frontend developer from Yangon. I build interactive web experiences with React, Tailwind, and a love for vintage aesthetics. This entire portfolio is a fake desktop OS — how cool is that?
            </span>,
          )
          break
        case 'sudo':
        case 'sudo rm -rf /':
        case 'rm -rf /':
          addLine(<span className="text-[#c07070]">Nice try. 😏</span>)
          break
        case 'exit':
          addLine(<span className="text-[#6a8a6a]">There is no escape. You're stuck in Kayv OS forever.</span>)
          break
        case 'clear':
          clearTerminal()
          break
        default:
          addLine(
            <>
              <span className="text-[#c07070]">Command not found: '{cmd}'</span><br />
              <span className="text-[#6a8a6a]">Type '<Cmd>help</Cmd>' for available commands</span>
            </>,
          )
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return
    addLine(
      <div>
        <span className="text-[#a0d0a0]">kayv@os</span>
        <span className="text-[#6a8a6a]">:</span>
        <span className="text-[#6a6aaa]">~</span>
        <span className="text-[#e0d8c8]">$ {input}</span>
      </div>,
    )
    await execCommand(input)
    setInput('')
  }

  return (
    <div className="w-full h-full p-4">
      <div
        className="relative flex flex-col h-full w-full overflow-hidden text-sm"
        style={{
          background: 'var(--os-terminal-bg)',
          color: 'var(--os-terminal-text)',
          fontFamily: MONO_STACK,
          padding: '12px',
          border: '1px solid var(--os-border-dark)',
          borderRadius: 'var(--os-btn-radius)',
        }}
        onClick={() => inputRef.current?.focus()}
      >
        {/* CRT scanline effect */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,255,0,0.03) 1px, rgba(0,255,0,0.03) 2px)' }}
        />

        <div className="flex-1 overflow-y-auto pr-2 mb-2 relative z-10" style={{ scrollbarWidth: 'thin', scrollbarColor: '#3a3a4a #1a1a2a' }}>
          {history.map((line, idx) => (
            <div key={idx} className="whitespace-pre-wrap select-text leading-relaxed mb-0.5">{line}</div>
          ))}
          {isLoading && (
            <div className="flex items-center text-[#6a8a6a] gap-0.5">
              <span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
            </div>
          )}
          <div ref={historyEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="flex items-center pt-2 relative z-10" style={{ borderTop: '1px solid #3a3a4a' }}>
          <span className="text-[#a0d0a0] mr-1 font-bold">kayv@os</span>
          <span className="text-[#6a8a6a] mr-1">:</span>
          <span className="text-[#6a6aaa] mr-1">~</span>
          <span className="text-[#e0d8c8] mr-2">$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent outline-none text-[#e0d8c8] placeholder-[#4a4a5a] font-semibold"
            style={{ caretColor: '#a0d0a0' }}
            placeholder={isLoading ? 'Processing...' : ''}
            aria-label="Terminal input"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            disabled={isLoading}
          />
        </form>

        <style>{`
          .dot {
            animation: blink-dot 1.4s infinite ease-in-out both;
            font-size: 20px;
            line-height: 1;
          }
          .dot:nth-child(1) { animation-delay: -0.32s; }
          .dot:nth-child(2) { animation-delay: -0.16s; }
          @keyframes blink-dot {
            0%, 80%, 100% { opacity: 0.2; }
            40% { opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  )
}

export default Terminal
