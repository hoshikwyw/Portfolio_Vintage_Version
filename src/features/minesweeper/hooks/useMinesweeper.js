import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { MAX_TIME } from '../constants'

/**
 * Board state lives in a reducer rather than several `useState` calls: a single
 * click can reveal hundreds of cells, end the game and stop the clock, and
 * those have to land together or the board renders half-updated.
 */

const makeCells = (count) =>
  Array.from({ length: count }, () => ({
    mine: false,
    adjacent: 0,
    revealed: false,
    flagged: false,
  }))

const createState = ({ cols, rows, mines }) => ({
  cols,
  rows,
  mines,
  cells: makeCells(cols * rows),
  /** `idle` until the first reveal, so the clock does not run on an untouched board. */
  status: 'idle',
  seconds: 0,
})

/** Indices of the up-to-eight cells surrounding `index`. */
const neighboursOf = (index, cols, rows) => {
  const x = index % cols
  const y = Math.floor(index / cols)
  const found = []

  for (let dy = -1; dy <= 1; dy += 1) {
    for (let dx = -1; dx <= 1; dx += 1) {
      if (dx === 0 && dy === 0) continue
      const nx = x + dx
      const ny = y + dy
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue
      found.push(ny * cols + nx)
    }
  }

  return found
}

/**
 * Lay the mines, avoiding `safeIndex` and everything touching it.
 *
 * Placing them only after the first click is what guarantees you can never
 * lose on move one. Excluding the neighbours too means that first click always
 * opens a pocket rather than a lone number — the same courtesy modern versions
 * extend, and it makes the opening a puzzle instead of a coin flip.
 */
const layMines = (cells, cols, rows, mineCount, safeIndex) => {
  const forbidden = new Set([safeIndex, ...neighboursOf(safeIndex, cols, rows)])
  const candidates = []

  for (let i = 0; i < cells.length; i += 1) {
    if (!forbidden.has(i)) candidates.push(i)
  }

  // Fisher–Yates, stopped once enough mines have been drawn.
  const total = Math.min(mineCount, candidates.length)
  for (let i = 0; i < total; i += 1) {
    const j = i + Math.floor(Math.random() * (candidates.length - i))
    ;[candidates[i], candidates[j]] = [candidates[j], candidates[i]]
  }

  const next = cells.map((cell) => ({ ...cell }))
  for (let i = 0; i < total; i += 1) next[candidates[i]].mine = true

  for (let i = 0; i < next.length; i += 1) {
    if (next[i].mine) continue
    next[i].adjacent = neighboursOf(i, cols, rows).filter((n) => next[n].mine).length
  }

  return next
}

/**
 * Reveal `index` and, if it has no adjacent mines, everything connected to it.
 *
 * Iterative rather than recursive — an empty expert board can cascade through
 * hundreds of cells in one click, which is enough to be worth not putting on
 * the call stack.
 */
const revealFrom = (cells, index, cols, rows) => {
  const next = cells.map((cell) => ({ ...cell }))
  const queue = [index]
  const seen = new Set(queue)

  while (queue.length) {
    const current = queue.pop()
    const cell = next[current]
    if (cell.revealed || cell.flagged) continue

    cell.revealed = true
    if (cell.adjacent !== 0 || cell.mine) continue

    for (const n of neighboursOf(current, cols, rows)) {
      if (seen.has(n)) continue
      seen.add(n)
      queue.push(n)
    }
  }

  return next
}

const hasWon = (cells) => cells.every((cell) => cell.mine || cell.revealed)

const reducer = (state, action) => {
  switch (action.type) {
    case 'reset':
      return createState(action.difficulty)

    case 'tick':
      return state.status === 'playing'
        ? { ...state, seconds: Math.min(state.seconds + 1, MAX_TIME) }
        : state

    case 'reveal': {
      if (state.status === 'won' || state.status === 'lost') return state

      const { index } = action
      const target = state.cells[index]
      if (target.revealed || target.flagged) return state

      // First click: only now are the mines placed, around the safe cell.
      const armed =
        state.status === 'idle'
          ? layMines(state.cells, state.cols, state.rows, state.mines, index)
          : state.cells

      if (armed[index].mine) {
        return {
          ...state,
          status: 'lost',
          cells: armed.map((cell) => (cell.mine ? { ...cell, revealed: true } : cell)),
        }
      }

      const cells = revealFrom(armed, index, state.cols, state.rows)
      const won = hasWon(cells)

      return {
        ...state,
        cells: won ? cells.map((c) => (c.mine ? { ...c, flagged: true } : c)) : cells,
        status: won ? 'won' : 'playing',
      }
    }

    case 'flag': {
      if (state.status === 'won' || state.status === 'lost') return state
      const cell = state.cells[action.index]
      if (cell.revealed) return state

      const cells = state.cells.map((c, i) =>
        i === action.index ? { ...c, flagged: !c.flagged } : c,
      )
      // Flagging alone never starts the clock — the original does the same.
      return { ...state, cells }
    }

    default:
      return state
  }
}

/**
 * Minesweeper game state for one difficulty.
 *
 * @param {{cols:number, rows:number, mines:number}} difficulty
 */
export const useMinesweeper = (difficulty) => {
  const [state, dispatch] = useReducer(reducer, difficulty, createState)

  // Rebuild the board whenever the chosen difficulty changes.
  useEffect(() => {
    dispatch({ type: 'reset', difficulty })
  }, [difficulty])

  // The clock only runs while a game is actually in progress.
  useEffect(() => {
    if (state.status !== 'playing') return
    const id = setInterval(() => dispatch({ type: 'tick' }), 1000)
    return () => clearInterval(id)
  }, [state.status])

  const reveal = useCallback((index) => dispatch({ type: 'reveal', index }), [])
  const toggleFlag = useCallback((index) => dispatch({ type: 'flag', index }), [])
  const reset = useCallback(() => dispatch({ type: 'reset', difficulty }), [difficulty])

  const flagged = useMemo(
    () => state.cells.reduce((total, cell) => total + (cell.flagged ? 1 : 0), 0),
    [state.cells],
  )

  return {
    ...state,
    // Can go negative, exactly like the original, if you over-flag.
    minesLeft: state.mines - flagged,
    reveal,
    toggleFlag,
    reset,
  }
}
