import { memo } from 'react'

/**
 * One square.
 *
 * Memoized because a single click can change hundreds of cells at once on an
 * expert board — without this, every remaining cell re-renders on every move.
 *
 * A real `<button>` rather than a div, so the whole grid is keyboard-operable:
 * Enter or Space reveals, and `F` flags (there is no right-click on a
 * keyboard, and Shift+F10 is not something anyone will guess).
 */
const Cell = memo(({ index, cell, isLost, onReveal, onFlag }) => {
  const { revealed, flagged, mine, adjacent } = cell

  const handleContextMenu = (event) => {
    // Suppress the browser menu so right-click can mean "flag" instead.
    event.preventDefault()
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

  return (
    <button
      type="button"
      className={classes.join(' ')}
      data-adjacent={revealed && !mine && adjacent ? adjacent : undefined}
      onClick={() => onReveal(index)}
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
