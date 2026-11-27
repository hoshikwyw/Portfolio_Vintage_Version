import { memo, useRef } from 'react'

/** How long a finger must rest on a square to flag it, and how far it may drift. */
const LONG_PRESS_MS = 450
const LONG_PRESS_SLOP_PX = 10

/**
 * One square.
 *
 * Memoized because a single click can change hundreds of cells at once on an
 * expert board — without this, every remaining cell re-renders on every move.
 *
 * A real `<button>` rather than a div, so the whole grid is keyboard-operable:
 * Enter or Space reveals, and `F` flags (there is no right-click on a
 * keyboard, and Shift+F10 is not something anyone will guess).
 *
 * On a touch screen there is no right-click either, so pressing and holding a
 * square flags it (the board also has a Dig / Flag switch). The press is
 * cancelled if the finger moves, so scrolling a large board never flags.
 */
const Cell = memo(({ index, cols, cell, isLost, onReveal, onFlag }) => {
  const { revealed, flagged, mine, adjacent } = cell
  const press = useRef({ timer: null, x: 0, y: 0, fired: false, touch: false })

  const cancelPress = () => {
    clearTimeout(press.current.timer)
    press.current.timer = null
  }

  const handlePointerDown = (event) => {
    press.current.touch = event.pointerType === 'touch' || event.pointerType === 'pen'
    press.current.fired = false
    if (!press.current.touch || revealed) return
    press.current.x = event.clientX
    press.current.y = event.clientY
    press.current.timer = setTimeout(() => {
      press.current.timer = null
      press.current.fired = true
      onFlag(index)
      navigator.vibrate?.(15)
    }, LONG_PRESS_MS)
  }

  const handlePointerMove = (event) => {
    if (!press.current.timer) return
    const moved = Math.hypot(event.clientX - press.current.x, event.clientY - press.current.y)
    if (moved > LONG_PRESS_SLOP_PX) cancelPress()
  }

  const handleClick = () => {
    // The tap that ended a long press has already flagged; it must not also dig.
    if (press.current.fired) {
      press.current.fired = false
      return
    }
    onReveal(index)
  }

  const handleContextMenu = (event) => {
    // Suppress the browser menu so right-click can mean "flag" instead.
    event.preventDefault()
    // Android also fires this on a long press, which the timer already handled.
    if (press.current.touch) return
    onFlag(index)
  }

  const handleKeyDown = (event) => {
    if (event.key !== 'f' && event.key !== 'F') return
    event.preventDefault()
    onFlag(index)
  }

  const classes = ['ms-cell']
  if (revealed) classes.push('is-revealed')
  if (revealed && mine) classes.push('is-mine')
  if (flagged && !revealed) classes.push('is-flagged')

  let label
  if (flagged && !revealed) label = 'Flagged'
  else if (!revealed) label = 'Hidden'
  else if (mine) label = 'Mine'
  else if (adjacent) label = `${adjacent}`
  else label = 'Empty'
  // Position, so a screen reader can tell one "Hidden" square from the next.
  label += `, row ${Math.floor(index / cols) + 1}, column ${(index % cols) + 1}`

  return (
    <button
      type="button"
      className={classes.join(' ')}
      data-adjacent={revealed && !mine && adjacent ? adjacent : undefined}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={cancelPress}
      onPointerCancel={cancelPress}
      onPointerLeave={cancelPress}
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
      // Revealed cells are inert, but stay focusable so arrowing across the
      // board does not hit dead gaps.
      aria-label={label}
      aria-disabled={revealed || undefined}
    >
      {flagged && !revealed ? '⚑' : null}
      {revealed && mine ? (isLost ? '✳' : '⚑') : null}
      {revealed && !mine && adjacent ? adjacent : null}
    </button>
  )
})

Cell.displayName = 'Cell'

export default Cell
