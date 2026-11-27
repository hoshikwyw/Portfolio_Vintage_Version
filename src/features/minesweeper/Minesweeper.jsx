import { useEffect, useMemo, useState } from 'react'
import { Flag, Shovel } from 'lucide-react'
import Panel from '@/shared/components/ui/Panel'
import { readStorageJSON, writeStorage } from '@/shared/lib/storage'
import { BEST_TIMES_KEY, DEFAULT_DIFFICULTY, DIFFICULTIES } from './constants'
import { useMinesweeper } from './hooks/useMinesweeper'
import Board from './components/Board'
import StatusBar from './components/StatusBar'
import './minesweeper.css'

const readBestTimes = () => readStorageJSON(BEST_TIMES_KEY, {})

const writeBestTimes = (times) => writeStorage(BEST_TIMES_KEY, JSON.stringify(times))

const HINT = {
  mouse: 'Left click to clear a square. Right click — or F — to flag one.',
  touch: 'Tap to clear a square. Press and hold one — or switch to Flag — to flag it.',
}

const OUTCOME = {
  won: 'Swept it. Every mine accounted for.',
  lost: 'That one was a mine. Hit the face to try again.',
}

/** A finger rather than a mouse: no right-click, so the touch hint and controls apply. */
const isTouchScreen = () => window.matchMedia('(pointer: coarse)').matches

/** Minesweeper, themed from the same tokens as the rest of the OS. */
const Minesweeper = () => {
  const [difficultyKey, setDifficultyKey] = useState(DEFAULT_DIFFICULTY)
  const [bestTimes, setBestTimes] = useState(readBestTimes)
  // What a tap does. Flag mode is the touch-screen stand-in for right-click.
  const [mode, setMode] = useState('dig')
  const [touch] = useState(isTouchScreen)

  const difficulty = useMemo(
    () => DIFFICULTIES.find((d) => d.key === difficultyKey) ?? DIFFICULTIES[0],
    [difficultyKey],
  )

  const { cells, cols, status, seconds, minesLeft, reveal, toggleFlag, reset } =
    useMinesweeper(difficulty)

  // Record a new best time when a game is won.
  useEffect(() => {
    if (status !== 'won') return

    setBestTimes((prev) => {
      const current = prev[difficultyKey]
      if (current !== undefined && current <= seconds) return prev

      const next = { ...prev, [difficultyKey]: seconds }
      writeBestTimes(next)
      return next
    })
    // `seconds` is deliberately not a dependency: it is read at the moment the
    // game is won, and re-running as the clock ticks would be meaningless.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, difficultyKey])

  const best = bestTimes[difficultyKey]

  return (
    <div className="ms-root">
      {/* --ms-cols drives the shell width; see .ms-shell in minesweeper.css. */}
      <div className="ms-shell" style={{ '--ms-cols': cols }}>
        <div className="ms-toolbar">
          {DIFFICULTIES.map((option) => (
            <button
              key={option.key}
              type="button"
              className={`ms-difficulty${option.key === difficultyKey ? ' is-active' : ''}`}
              onClick={() => setDifficultyKey(option.key)}
              aria-pressed={option.key === difficultyKey}
            >
              {option.label}
            </button>
          ))}
        </div>

        <StatusBar minesLeft={minesLeft} seconds={seconds} status={status} onReset={reset} />

        {touch && (
          <div className="ms-mode" role="group" aria-label="What a tap does">
            <button
              type="button"
              className={`ms-mode-btn${mode === 'dig' ? ' is-active' : ''}`}
              onClick={() => setMode('dig')}
              aria-pressed={mode === 'dig'}
            >
              <Shovel size={14} aria-hidden="true" />
              Dig
            </button>
            <button
              type="button"
              className={`ms-mode-btn${mode === 'flag' ? ' is-active' : ''}`}
              onClick={() => setMode('flag')}
              aria-pressed={mode === 'flag'}
            >
              <Flag size={14} aria-hidden="true" />
              Flag
            </button>
          </div>
        )}

        {/* The board scrolls rather than forcing the window wide enough for Expert. */}
        <div className="ms-board-scroll">
          <Board
            cells={cells}
            cols={cols}
            status={status}
            onReveal={mode === 'flag' ? toggleFlag : reveal}
            onFlag={toggleFlag}
          />
        </div>

        {/* Polite, so a screen reader hears the outcome without being interrupted. */}
        <p className="ms-message" aria-live="polite">{OUTCOME[status] ?? HINT[touch ? 'touch' : 'mouse']}</p>

        <Panel title="Best time" style={{ padding: '8px 10px' }}>
          <div className="ms-best">
            {DIFFICULTIES.map((option) => (
              <div key={option.key}>
                <span className="ms-best-label">{option.label}</span>
                <span className="ms-best-value">
                  {bestTimes[option.key] !== undefined ? `${bestTimes[option.key]}s` : '—'}
                </span>
              </div>
            ))}
          </div>
          {best !== undefined && status === 'won' && seconds === best && (
            <p className="ms-best-new">New best time!</p>
          )}
        </Panel>
      </div>
    </div>
  )
}

export default Minesweeper
