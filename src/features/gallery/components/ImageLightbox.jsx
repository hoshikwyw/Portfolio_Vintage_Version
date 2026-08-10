import { useEffect } from 'react'
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
  // Close on Escape and lock body scroll while open.
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  const title = image.projects?.title
  const demoUrl = image.projects?.demo_url

  return (
    <div className="image-modal-overlay" onClick={onClose}>
      <div className="image-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="image-modal-close" onClick={onClose} aria-label="Close modal">
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
