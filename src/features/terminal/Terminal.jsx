import { useCallback, useEffect, useRef, useState } from 'react'
import { useProjects } from '@/features/projects/hooks/useProjects'
import { MONO_STACK } from '@/shared/constants/fonts'
import { Cmd, Dim, Path, Plain } from './components/TerminalText'
import { resolveCommand, unknownCommand, welcomeMessage } from './commands'

/** Fake latency, so output doesn't appear instantly and break the illusion. */
const COMMAND_DELAY = 400

const Prompt = () => (
  <>
    <Cmd>kayv@os</Cmd>
    <Dim>:</Dim>
    <Path>~</Path>
  </>
)

/**
 * CRT-styled fake shell. Commands are resolved from the local registry in
 * `./commands` against React Query data; there is no real backend.
 */
const Terminal = () => {
  const [history, setHistory] = useState([welcomeMessage])
  const [input, setInput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const inputRef = useRef(null)
  const historyEndRef = useRef(null)

  const { data: projects } = useProjects()

  useEffect(() => {
    inputRef.current?.focus()
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, isRunning])

  const print = useCallback((line) => setHistory((lines) => [...lines, line]), [])
  const clear = useCallback(() => setHistory([welcomeMessage]), [])

  const run = async (rawInput) => {
    setIsRunning(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, COMMAND_DELAY))

      const command = resolveCommand(rawInput)
      if (!command) {
        print(unknownCommand(rawInput))
        return
      }

      const output = command.run({ input: rawInput.trim(), projects, clear })
      if (output) print(output)
    } finally {
      setIsRunning(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    print(
      <div>
        <Prompt />
        <Plain>$ {input}</Plain>
      </div>,
    )
    const submitted = input
    setInput('')
    await run(submitted)
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
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, var(--os-terminal-scanline) 1px, var(--os-terminal-scanline) 2px)' }}
        />

        <div
          className="flex-1 overflow-y-auto pr-2 mb-2 relative z-10"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--os-terminal-border) var(--os-terminal-bg)' }}
        >
          {history.map((line, idx) => (
            <div key={idx} className="whitespace-pre-wrap select-text leading-relaxed mb-0.5">{line}</div>
          ))}
          {isRunning && (
            <div className="os-terminal-dots flex items-center gap-0.5" style={{ color: 'var(--os-terminal-prompt)' }}>
              <span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
            </div>
          )}
          <div ref={historyEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="flex items-center pt-2 relative z-10" style={{ borderTop: '1px solid var(--os-terminal-border)' }}>
          <span className="mr-1"><Prompt /></span>
          <span className="mr-2" style={{ color: 'var(--os-terminal-plain)' }}>$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="os-terminal-input flex-1 bg-transparent outline-none font-semibold"
            style={{ color: 'var(--os-terminal-plain)', caretColor: 'var(--os-terminal-accent)' }}
            placeholder={isRunning ? 'Processing...' : ''}
            aria-label="Terminal input"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            disabled={isRunning}
          />
        </form>

      </div>
    </div>
  )
}

export default Terminal
