import { useCallback, useEffect, useRef, useState } from 'react'
import { useProjects } from '@/features/projects/hooks/useProjects'
import { MONO_STACK } from '@/shared/constants/fonts'
import { system } from '@/shared/config/profile'
import { Cmd, Dim, Path } from './components/TerminalText'
import { commandNames, resolveCommand, unknownCommand } from './commands'
import './terminal.css'

/** Fake latency, so output doesn't appear instantly and break the illusion. */
const COMMAND_DELAY = 250

/** Commands offered as one-click chips in the welcome banner. */
const QUICK_COMMANDS = ['help', 'about', 'projects', 'skills', 'tools']

/** Longest prefix every string in the list shares. */
const commonPrefix = (words) =>
  words.reduce((prefix, word) => {
    let i = 0
    while (i < prefix.length && prefix[i] === word[i]) i += 1
    return prefix.slice(0, i)
  })

const Prompt = () => (
  <span className="os-term-prompt">
    <Cmd>kayv@os</Cmd>
    <Dim>:</Dim>
    <Path>~</Path>
    <Dim>$</Dim>
  </span>
)

/**
 * The banner the shell opens with: a title, a login line, and the commands
 * worth trying as buttons — a visitor should not have to know to type `help`.
 */
const Welcome = ({ onRun, disabled, loginTime }) => (
  <div className="os-term-welcome">
    <p>
      {/* Same shell name `neofetch` reports. */}
      <Cmd>kayv-terminal</Cmd> <Dim>v{system.version}</Dim>
    </p>
    <p><Dim>Last login: {loginTime}</Dim></p>
    <div className="os-term-chips" role="group" aria-label="Try a command">
      {QUICK_COMMANDS.map((name) => (
        <button
          key={name}
          type="button"
          className="os-term-chip"
          onClick={() => onRun(name)}
          disabled={disabled}
          aria-label={`Run ${name}`}
        >
          {name}
        </button>
      ))}
    </div>
    <p className="os-term-tip">
      <Dim>↑/↓ history · Tab completes · Ctrl+L clears</Dim>
    </p>
  </div>
)

let nextId = 0
const welcomeEntry = () => ({ id: nextId++, welcome: true })

/**
 * A fake shell, laid out like a real one: each command is echoed after the
 * prompt with its output underneath, and the live prompt follows the last
 * output instead of sitting in a separate bar.
 *
 * Commands come from the local registry in `./commands`, run against React
 * Query data; there is no real backend. ↑/↓ walk previous commands, Tab
 * completes a command name (or lists the candidates), Ctrl+L clears.
 */
const Terminal = () => {
  const [entries, setEntries] = useState(() => [welcomeEntry()])
  const [input, setInput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [loginTime] = useState(() => new Date().toLocaleString())
  const inputRef = useRef(null)
  const scrollRef = useRef(null)
  // Submitted commands, oldest first, and where ↑/↓ currently points into them.
  const pastCommands = useRef([])
  const recallIndex = useRef(-1)

  const { data: projects } = useProjects()

  // Keep the newest output in view, and the prompt focused once a command ends.
  useEffect(() => {
    const scroller = scrollRef.current
    if (scroller) scroller.scrollTop = scroller.scrollHeight
  }, [entries, isRunning])

  useEffect(() => {
    if (!isRunning) inputRef.current?.focus({ preventScroll: true })
  }, [isRunning])

  const clear = useCallback(() => setEntries([]), [])

  const run = useCallback(async (rawInput) => {
    const typed = rawInput.trim()
    if (!typed) return

    pastCommands.current.push(typed)
    recallIndex.current = -1
    setInput('')

    const id = nextId++
    setEntries((list) => [...list, { id, input: typed, output: null }])
    setIsRunning(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, COMMAND_DELAY))
      const command = resolveCommand(typed)
      const output = command ? command.run({ input: typed, projects, clear }) : unknownCommand(typed)
      // `clear` empties the list itself and returns nothing; a missing id is a no-op.
      if (output) setEntries((list) => list.map((entry) => (entry.id === id ? { ...entry, output } : entry)))
    } finally {
      setIsRunning(false)
    }
  }, [projects, clear])

  const recall = (step) => {
    const past = pastCommands.current
    if (!past.length) return
    const from = recallIndex.current === -1 ? past.length : recallIndex.current
    const next = Math.min(Math.max(from + step, 0), past.length)
    recallIndex.current = next === past.length ? -1 : next
    setInput(next === past.length ? '' : past[next])
  }

  const complete = () => {
    const typed = input.trimStart().toLowerCase()
    if (!typed || typed.includes(' ')) return
    const matches = commandNames.filter((name) => name.startsWith(typed))
    if (matches.length === 1) {
      setInput(matches[0])
    } else if (matches.length > 1) {
      const prefix = commonPrefix(matches)
      if (prefix.length > typed.length) setInput(prefix)
      else setEntries((list) => [...list, { id: nextId++, input: typed, output: <Dim>{matches.join('    ')}</Dim> }])
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowUp') { event.preventDefault(); recall(-1) }
    else if (event.key === 'ArrowDown') { event.preventDefault(); recall(1) }
    else if (event.key === 'Tab') { event.preventDefault(); complete() }
    else if (event.key === 'l' && event.ctrlKey) { event.preventDefault(); clear() }
  }

  // Clicking anywhere focuses the prompt — unless the visitor is selecting
  // output to copy, which a focus change would cancel.
  const focusPrompt = () => {
    if (!window.getSelection()?.toString()) inputRef.current?.focus({ preventScroll: true })
  }

  return (
    <div className="os-term" style={{ fontFamily: MONO_STACK }} onClick={focusPrompt}>
      <div className="os-scanlines opacity-[0.04]" />

      <div ref={scrollRef} className="os-term-scroll os-terminal-scroll">
        {/* A log: screen readers announce each command's output as it lands. */}
        <div role="log" aria-live="polite" aria-label="Terminal output">
          {entries.map((entry) =>
            entry.welcome ? (
              <Welcome key={entry.id} onRun={run} disabled={isRunning} loginTime={loginTime} />
            ) : (
              <div key={entry.id} className="os-term-block">
                <div className="os-term-line">
                  <Prompt />
                  <span className="os-term-echo">{entry.input}</span>
                </div>
                {entry.output && <div className="os-term-output">{entry.output}</div>}
              </div>
            ),
          )}
        </div>

        {isRunning ? (
          <div className="os-terminal-dots" aria-hidden="true">
            <span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
          </div>
        ) : (
          <form
            className="os-term-line"
            onSubmit={(event) => { event.preventDefault(); run(input) }}
          >
            <Prompt />
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              className="os-terminal-input os-term-input"
              aria-label="Terminal input"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
          </form>
        )}
      </div>
    </div>
  )
}

export default Terminal
