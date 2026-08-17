import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { caseStudyRows } from '../caseStudy'

/**
 * Full case study for one project, laid over the carousel.
 *
 * Covers the window rather than opening a separate one: the reader is already
 * looking at the project, and pushing them into new window chrome to read two
 * paragraphs would cost more attention than the writing is worth.
 *
 * Escape closes it, and the event is stopped so the window underneath does not
 * also close — the same arrangement the gallery lightbox uses.
 */
const CaseStudyPanel = ({ project, onClose }) => {
  const panelRef = useRef(null)
  const rows = caseStudyRows(project)

  useEffect(() => {
    const opener = document.activeElement
    panelRef.current?.focus({ preventScroll: true })

    return () => {
      if (opener instanceof HTMLElement && document.contains(opener)) {
        opener.focus({ preventScroll: true })
      }
    }
  }, [])

  const handleKeyDown = (event) => {
    if (event.key !== 'Escape') return
    event.preventDefault()
    event.stopPropagation()
    onClose()
  }

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label={`${project.title} case study`}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      className="case-study"
    >
      <header className="case-study-bar">
        <div className="case-study-heading">
          <h3 className="case-study-title">{project.title}</h3>
          {project.year && <span className="case-study-year">{project.year}</span>}
        </div>
        <button type="button" onClick={onClose} className="case-study-close" aria-label="Close case study">
          <X size={12} aria-hidden="true" />
        </button>
      </header>

      <div className="case-study-body">
        {rows.map(({ key, label, value }) => (
          <section key={key} className="case-study-row">
            <h4 className="case-study-label">{label}</h4>
            {/* `white-space: pre-line` in CSS, so paragraph breaks typed in the
                admin form survive without needing a markdown renderer. */}
            <p className="case-study-text">{value}</p>
          </section>
        ))}

        {project.tags?.length > 0 && (
          <section className="case-study-row">
            <h4 className="case-study-label">Built with</h4>
            <div className="case-study-tags">
              {project.tags.map((tag) => (
                <span key={tag} className="case-study-tag">{tag}</span>
              ))}
            </div>
          </section>
        )}

        <div className="case-study-links">
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="quick-action-btn quick-action-primary custom-link"
            >
              Live Demo
            </a>
          )}
          {project.repo_url && (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="quick-action-btn custom-link"
            >
              View Code
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default CaseStudyPanel
