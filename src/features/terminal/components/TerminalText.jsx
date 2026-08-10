/** Phosphor-green palette for terminal output. */

/** Body text in the primary green. */
export const Green = ({ children }) => <span className="text-[#a0d0a0]">{children}</span>

/** A command name or heading — bright green, bold. */
export const Cmd = ({ children }) => <span className="text-[#a0d0a0] font-bold">{children}</span>

/** De-emphasised hint text. */
export const Dim = ({ children }) => <span className="text-[#6a8a6a]">{children}</span>

/** Neutral off-white output. */
export const Plain = ({ children }) => <span className="text-[#e0d8c8]">{children}</span>

/** Error / warning output. */
export const Alert = ({ children }) => <span className="text-[#c07070]">{children}</span>
