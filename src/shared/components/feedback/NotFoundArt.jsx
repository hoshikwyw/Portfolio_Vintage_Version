/**
 * The 404 box and shrug shared by the in-window and full-page not-found
 * screens.
 *
 * The shrug sits *under* the box rather than inside it: `ツ` is a double-width
 * glyph whose real width depends on which fallback font renders it, so a
 * border drawn around it never lined up.
 *
 * Decorative — a screen reader would otherwise spell out every box-drawing
 * character. The text beside it says "not found" in words.
 */
const NotFoundArt = ({ color }) => (
  <pre className="text-xs leading-tight select-none text-center" style={{ color }} aria-hidden="true">{`┌─────────┐
│  4 0 4  │
└─────────┘
¯\\_(ツ)_/¯`}</pre>
)

export default NotFoundArt
