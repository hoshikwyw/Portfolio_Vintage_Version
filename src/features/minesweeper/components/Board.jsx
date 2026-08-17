import Cell from './Cell'

/** The grid of squares, sunk into the panel like the original's play field. */
const Board = ({ cells, cols, status, onReveal, onFlag }) => (
  <div
    className="ms-board"
    style={{ gridTemplateColumns: `repeat(${cols}, var(--ms-cell))` }}
    role="grid"
    aria-label="Minefield"
  >
    {cells.map((cell, index) => (
      <Cell
        key={index}
        index={index}
        cell={cell}
        isLost={status === 'lost'}
        onReveal={onReveal}
        onFlag={onFlag}
      />
    ))}
  </div>
)

export default Board
