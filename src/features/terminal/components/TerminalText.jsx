/**
 * Semantic spans for terminal output.
 *
 * Each role maps to an `--os-terminal-*` token rather than a literal colour, so
 * the shell re-skins with the theme — the light theme turns this from phosphor
 * green on black into dark ink on paper without touching any command.
 */

/** Body text in the primary accent. */
export const Green = ({ children }) => <span style={{ color: 'var(--os-terminal-accent)' }}>{children}</span>

/** A command name or heading — accent, bold. */
export const Cmd = ({ children }) => (
  <span className="font-bold" style={{ color: 'var(--os-terminal-accent)' }}>{children}</span>
)

/** De-emphasised hint text. */
export const Dim = ({ children }) => <span style={{ color: 'var(--os-terminal-prompt)' }}>{children}</span>

/** Neutral high-contrast output. */
export const Plain = ({ children }) => <span style={{ color: 'var(--os-terminal-plain)' }}>{children}</span>

/** Error / warning output. */
export const Alert = ({ children }) => <span style={{ color: 'var(--os-terminal-alert)' }}>{children}</span>

/** Paths, filenames and ASCII art — the terminal's secondary hue. */
export const Path = ({ children, className = '' }) => (
  <span className={className} style={{ color: 'var(--os-terminal-path)' }}>{children}</span>
)
