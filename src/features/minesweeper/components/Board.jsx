import Cell from './Cell'

/**
 * The grid of squares, sunk into the panel like the original's play field.
 *
 * `role="group"`, not `grid`: an ARIA grid must be built from `row` and
 * `gridcell` elements with arrow-key navigation, and this is a flat run of
 * buttons laid out by CSS. Each cell names its own row and column instead.
 */
const Board = ({ cells, cols, status, onReveal, onFlag }) => (
  <div
    className="ms-board"
    style={{ gridTemplateColumns: `repeat(${cols}, var(--ms-cell))` }}
    role="group"
    aria-label="Minefield"
  >
    {cells.map((cell, index) => (
      <Cell
        key={index}
        index={index}
        cols={cols}
        cell={cell}
        isLost={status === 'lost'}
        onReveal={onReveal}
        onFlag={onFlag}
      />
    ))}
  </div>
)

export default Board
