import { useEffect, useRef } from 'react'
import { Code2, ExternalLink, X } from 'lucide-react'
import { caseStudyRows } from '@/features/projects/caseStudy'

/**
 * A project's case study in a native modal <dialog>.
 *
 * `showModal()` gives the page everything a modal needs for free: the rest of
 * the page goes inert, Escape closes it, focus moves in and — on close —
 * returns to the button that opened it. Mounted only while a project is
 * selected; closing (button, Escape or a click on the backdrop) reports back
 * through `onClose`, which unmounts it.
 */
const CaseStudyDialog = ({ project, onClose }) => {
  const dialogRef = useRef(null)
  const rows = caseStudyRows(project)

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) dialog.showModal()
  }, [])

  // A click that lands on the dialog element itself is on the backdrop: the
  // content fills the box, so any click inside hits a child instead.
  const closeOnBackdrop = (event) => {
    if (event.target === dialogRef.current) dialogRef.current.close()
  }

  return (
    <dialog
      ref={dialogRef}
      className="op-dialog"
      aria-labelledby="op-dialog-title"
      onClose={onClose}
      onClick={closeOnBackdrop}
    >
      <div className="op-dialog-body">
        <header className="op-dialog-head">
          <div>
            <p className="op-section-label">Case study{project.year ? ` · ${project.year}` : ''}</p>
            <h2 id="op-dialog-title" className="op-dialog-title">{project.title}</h2>
          </div>
          <button
            type="button"
            className="op-icon-btn"
            onClick={() => dialogRef.current.close()}
            aria-label="Close case study"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        {project.cover_image && (
          <img src={project.cover_image} alt="" className="op-dialog-cover" decoding="async" />
        )}

        {rows.map(({ key, label, value }) => (
          <section key={key} className="op-dialog-row">
            <h3 className="op-dialog-label">{label}</h3>
            {/* pre-line in CSS keeps paragraph breaks typed in the admin form. */}
            <p className="op-dialog-text">{value}</p>
          </section>
        ))}

        {project.tags?.length > 0 && (
          <section className="op-dialog-row">
            <h3 className="op-dialog-label">Built with</h3>
            <ul className="op-chips">
              {project.tags.map((tag) => <li key={tag} className="op-chip">{tag}</li>)}
            </ul>
          </section>
        )}

        {(project.demo_url || project.repo_url) && (
          <div className="op-dialog-actions">
            {project.demo_url && (
              <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="op-btn op-btn-primary">
                <ExternalLink size={15} aria-hidden="true" />
                Live demo
              </a>
            )}
            {project.repo_url && (
              <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="op-btn">
                <Code2 size={15} aria-hidden="true" />
                Source code
              </a>
            )}
          </div>
        )}
      </div>
    </dialog>
  )
}

export default CaseStudyDialog
