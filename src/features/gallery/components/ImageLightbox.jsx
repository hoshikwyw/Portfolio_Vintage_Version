import { useEffect, useRef } from 'react'
import { Download, ExternalLink } from 'lucide-react'
import { useRestoreFocus } from '@/shared/hooks/useRestoreFocus'
import { downloadFile } from '@/shared/lib/browser'

/** Full-size image overlay. Closes on backdrop click or Escape. */
const ImageLightbox = ({ image, onClose }) => {
  const closeRef = useRef(null)

  // This is a genuinely modal overlay, so focus moves into it, and returns to
  // the tile that opened it on close.
  useRestoreFocus(closeRef)

  // Lock body scroll while open, restoring whatever was there before.
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key !== 'Escape') return

      /*
       * Claim the event so the Gallery window underneath does not also close.
       * Registered in the *capture* phase, which runs on `document` before the
       * event reaches React's root listener, so `stopPropagation` here means
       * the window's own Escape handler never sees it. `preventDefault` marks
       * it handled for anything that checks rather than relying on ordering.
       */
      e.stopPropagation()
      e.preventDefault()
      onClose()
    }

    document.addEventListener('keydown', handleEscape, true)
    return () => document.removeEventListener('keydown', handleEscape, true)
  }, [onClose])

  const title = image.projects?.title
  const demoUrl = image.projects?.demo_url

  return (
    <div className="image-modal-overlay" onClick={onClose}>
      <div
        className="image-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title ? `${title} — full size image` : 'Full size image'}
      >
        <button ref={closeRef} className="image-modal-close" onClick={onClose} aria-label="Close image viewer">
          ×
        </button>

        <div className="image-modal-image-container">
          <img src={image.image_url} alt={title || `Image ${image.id}`} className="image-modal-image" />
        </div>

        <div className="image-modal-actions-bar">
          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="image-modal-action-btn image-modal-view-btn"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="image-modal-icon" aria-hidden="true" />
              View Project
            </a>
          )}
          <button
            className="image-modal-action-btn image-modal-download-btn"
            onClick={() => downloadFile(image.image_url, `project-image-${image.id}.jpg`)}
          >
            <Download className="image-modal-icon" aria-hidden="true" />
            Download
          </button>
        </div>
      </div>
    </div>
  )
}

export default ImageLightbox
