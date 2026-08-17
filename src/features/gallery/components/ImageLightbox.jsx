import { useEffect, useRef } from 'react'
import { downloadFile } from '@/shared/lib/browser'

const ExternalIcon = () => (
  <svg className="image-modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

const DownloadIcon = () => (
  <svg className="image-modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

/** Full-size image overlay. Closes on backdrop click or Escape. */
const ImageLightbox = ({ image, onClose }) => {
  const closeRef = useRef(null)

  // Close on Escape and lock body scroll while open.
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
    document.body.style.overflow = 'hidden'

    // This is a genuinely modal overlay, so focus moves into it. The Gallery
    // restores focus to the tile that opened it when this unmounts.
    const opener = document.activeElement
    closeRef.current?.focus({ preventScroll: true })

    return () => {
      document.removeEventListener('keydown', handleEscape, true)
      document.body.style.overflow = 'unset'
      if (opener instanceof HTMLElement && document.contains(opener)) {
        opener.focus({ preventScroll: true })
      }
    }
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
              <ExternalIcon />
              View Project
            </a>
          )}
          <button
            className="image-modal-action-btn image-modal-download-btn"
            onClick={() => downloadFile(image.image_url, `project-image-${image.id}.jpg`)}
          >
            <DownloadIcon />
            Download
          </button>
        </div>
      </div>
    </div>
  )
}

export default ImageLightbox
