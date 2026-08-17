/**
 * Inline icons for every window, drawn in `currentColor`.
 *
 * These were flat PNG/SVG files rendered through `<img>` and tinted with
 * `filter: brightness(0) invert(1)`, which can only ever produce pure black or
 * pure white — so they could not take a theme colour, could not be two-tone,
 * and could not transition on hover. As inline SVG they simply inherit `color`
 * from whatever they sit in: the wallpaper-facing desktop label colour, the
 * taskbar's text colour, the title bar's. One drawing, correct everywhere.
 *
 * Depth comes from `.os-icon-soft`, which is the same `currentColor` at
 * reduced opacity — so the second tone can never clash with a theme, however
 * the palette changes.
 *
 * All glyphs share a 24×24 box and a chunky, geometric weight that suits the
 * beveled chrome better than the mixed-source outlines they replace.
 */

const Home = () => (
  <>
    <rect x="2.5" y="4" width="19" height="16" rx="2.5" className="os-icon-soft" />
    <circle cx="9" cy="10.6" r="2.6" />
    <path d="M4.6 17.4c0-2.3 2-3.6 4.4-3.6s4.4 1.3 4.4 3.6z" />
    <rect x="15" y="9.2" width="4.4" height="1.7" rx="0.85" />
    <rect x="15" y="12.6" width="4.4" height="1.7" rx="0.85" />
  </>
)

const Projects = () => (
  <>
    <path className="os-icon-soft" d="M2.5 6.2a2 2 0 0 1 2-2h4.1l2.1 2.2h8.8a2 2 0 0 1 2 2v1.2H2.5z" />
    <rect x="2.5" y="8.8" width="19" height="11" rx="2.2" />
  </>
)

const Gallery = () => (
  <>
    <rect x="2.5" y="4.5" width="19" height="15" rx="2.4" className="os-icon-soft" />
    <circle cx="8.4" cy="9.8" r="1.9" />
    <path d="M4.2 19.5 9.6 13l3.4 3.6 3-2.8 4.6 5.7z" />
  </>
)

const Terminal = () => (
  <>
    <rect x="2.2" y="4.2" width="19.6" height="15.6" rx="2.4" className="os-icon-soft" />
    <path
      d="M6.4 9.2 9.6 12l-3.2 2.8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x="11.6" y="13.2" width="6.2" height="1.8" rx="0.9" />
  </>
)

const TEETH = [0, 45, 90, 135, 180, 225, 270, 315]

const Settings = () => (
  <>
    {TEETH.map((angle) => (
      <rect
        key={angle}
        x="10.9"
        y="1.6"
        width="2.2"
        height="4.6"
        rx="1"
        transform={`rotate(${angle} 12 12)`}
      />
    ))}
    <circle cx="12" cy="12" r="7" className="os-icon-soft" />
    <circle cx="12" cy="12" r="3" />
  </>
)

const SPIKES = [0, 45, 90, 135]

const Minesweeper = () => (
  <>
    {SPIKES.map((angle) => (
      <rect
        key={angle}
        x="11.2"
        y="2.4"
        width="1.6"
        height="19.2"
        rx="0.8"
        className="os-icon-soft"
        transform={`rotate(${angle} 12 12)`}
      />
    ))}
    <circle cx="12" cy="12" r="6.4" />
  </>
)

const Dashboard = () => (
  <>
    <path
      d="M7.6 10.6V8.2a4.4 4.4 0 0 1 8.8 0v2.4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      className="os-icon-soft-stroke"
    />
    <rect x="4.4" y="10.2" width="15.2" height="9.6" rx="2.4" />
  </>
)

/** App id → glyph. Keys match `@/os/config/apps`. */
const glyphs = {
  Home,
  Projects,
  Gallery,
  'Send-Message': Terminal,
  Settings,
  Minesweeper,
  Dashboard,
}

/**
 * Render an app's icon at `size`, inheriting the surrounding `color`.
 *
 * @param {string} id   App id.
 * @param {number} size Rendered box in px.
 */
const AppIcon = ({ id, size = 24, className = '' }) => {
  const Glyph = glyphs[id]
  if (!Glyph) return null

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`os-app-icon ${className}`.trim()}
      aria-hidden="true"
      focusable="false"
    >
      <Glyph />
    </svg>
  )
}

export default AppIcon
