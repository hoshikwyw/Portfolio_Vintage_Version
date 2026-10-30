/**
 * The opening of every section: a small numbered label in monospace (a nod to
 * the terminal), the title, and an optional line of intro.
 *
 * @param {string} index Two-digit section number, e.g. "01".
 * @param {string} id    Used to label the section by its heading.
 */
const SectionHeading = ({ index, label, title, intro, id }) => (
  <header className="op-section-head">
    <p className="op-section-label">
      <span aria-hidden="true">{index} //</span> {label}
    </p>
    <h2 id={id} className="op-section-title">{title}</h2>
    {intro && <p className="op-section-intro">{intro}</p>}
  </header>
)

export default SectionHeading
