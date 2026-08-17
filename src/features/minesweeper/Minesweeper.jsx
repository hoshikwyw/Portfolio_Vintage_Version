import { useEffect, useMemo, useState } from 'react'
import Panel from '@/shared/components/ui/Panel'
import { FONT_STACK } from '@/shared/constants/fonts'
import { BEST_TIMES_KEY, DEFAULT_DIFFICULTY, DIFFICULTIES } from './constants'
import { useMinesweeper } from './hooks/useMinesweeper'
import Board from './components/Board'
import StatusBar from './components/StatusBar'

const readBestTimes = () => {
  try {
    return JSON.parse(localStorage.getItem(BEST_TIMES_KEY) ?? '{}')
  } catch {
    return {}
  }
}

const writeBestTimes = (times) => {
  try {
    localStorage.setItem(BEST_TIMES_KEY, JSON.stringify(times))
  } catch {
    // Best times are a nicety; the game plays fine without them.
  }
}

const MESSAGES = {
  idle: 'Left click to clear a square. Right click — or F — to flag one.',
  playing: 'Left click to clear a square. Right click — or F — to flag one.',
  won: 'Swept it. Every mine accounted for.',
  lost: 'That one was a mine. Hit the face to try again.',
}

/** Minesweeper, themed from the same tokens as the rest of the OS. */
const Minesweeper = () => {
  const [difficultyKey, setDifficultyKey] = useState(DEFAULT_DIFFICULTY)
  const [bestTimes, setBestTimes] = useState(readBestTimes)

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
    <div className="ms-root" style={{ fontFamily: FONT_STACK }}>
      <div className="ms-shell">
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

        {/* The board scrolls rather than forcing the window wide enough for Expert. */}
        <div className="ms-board-scroll">
          <Board
            cells={cells}
            cols={cols}
            status={status}
            onReveal={reveal}
            onFlag={toggleFlag}
          />
        </div>

        {/* Polite, so a screen reader hears the outcome without being interrupted. */}
        <p className="ms-message" aria-live="polite">{MESSAGES[status]}</p>

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
