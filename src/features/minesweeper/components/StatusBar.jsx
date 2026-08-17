import { MAX_TIME } from '../constants'

/** Three digits with leading zeros, like the original's LED readouts. */
const pad = (value) => String(Math.max(0, Math.min(value, MAX_TIME))).padStart(3, '0')

const FACES = {
  idle: '🙂',
  playing: '🙂',
  won: '😎',
  lost: '😵',
}

/** Mine counter, reset face and timer. */
const StatusBar = ({ minesLeft, seconds, status, onReset }) => (
  <div className="ms-status">
    {/* Negative counts are possible if you over-flag — the original allows it too. */}
    <span className="ms-readout" aria-label={`${minesLeft} mines remaining`}>
      {minesLeft < 0 ? `-${pad(Math.abs(minesLeft))}` : pad(minesLeft)}
    </span>

    <button
      type="button"
      className="ms-face"
      onClick={onReset}
      aria-label="New game"
      title="New game"
    >
      <span aria-hidden="true">{FACES[status] ?? FACES.idle}</span>
    </button>

    <span className="ms-readout" aria-label={`${seconds} seconds elapsed`}>
      {pad(seconds)}
    </span>
  </div>
)

export default StatusBar
