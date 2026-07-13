import { useState, useEffect } from 'react'
import { useProjectImages } from '@/hooks/useProjectImages'
import { FONT_STACK } from '@/constants/ui'
import './Gallery.css'

// Centered single-line status message (loading / error / empty states).
const StatusMessage = ({ children, color = '#5a5a5a' }) => (
  <div className="w-full h-full flex items-center justify-center">
    <p className="text-[12px]" style={{ color, fontFamily: FONT_STACK }}>{children}</p>
  </div>
)

const Gallery = () => {
  const { data: images, isLoading, isError } = useProjectImages()
  const [loadedImages, setLoadedImages] = useState(new Set())
  const [selectedImage, setSelectedImage] = useState(null)

  const handleImageLoad = (id) => {
    setLoadedImages((prev) => new Set([...prev, id]))
  }

  // Close the lightbox on Escape and lock body scroll while it is open.
  useEffect(() => {
    if (!selectedImage) return

    const handleEscape = (e) => {
      if (e.key === 'Escape') setSelectedImage(null)
    }
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [selectedImage])

  const downloadImage = (image) => {
    const link = document.createElement('a')
    link.href = image.image_url
    link.download = `project-image-${image.id}.jpg`
    link.click()
  }

  if (isLoading) return <StatusMessage>Loading images...</StatusMessage>
  if (isError) return <StatusMessage color="#8a3030">Error loading images</StatusMessage>
  if (!images || images.length === 0) return <StatusMessage>No images found</StatusMessage>

  return (
    <>
      <div className="w-full h-full overflow-y-auto project-images-container">
        <div className="masonry-grid">
          {images.map((image) => (
            <div key={image.id} onClick={() => setSelectedImage(image)} className="masonry-item">
              <div className="image-card">
                {!loadedImages.has(image.id) && <div className="image-skeleton" />}
                <img
                  src={image.image_url}
                  alt={image.projects?.title || `Image ${image.id}`}
                  className={`project-image ${loadedImages.has(image.id) ? 'loaded' : ''}`}
                  onLoad={() => handleImageLoad(image.id)}
                />
                <div className="image-label">
                  <span>{image.projects?.title}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div className="image-modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="image-modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="image-modal-close" onClick={() => setSelectedImage(null)} aria-label="Close modal">
              ×
            </button>

            <div className="image-modal-image-container">
              <img
                src={selectedImage.image_url}
                alt={selectedImage.projects?.title || `Image ${selectedImage.id}`}
                className="image-modal-image"
              />
            </div>

            <div className="image-modal-actions-bar">
              {selectedImage.projects?.demo_url && (
                <a
                  href={selectedImage.projects.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="image-modal-action-btn image-modal-view-btn"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg className="image-modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  View Project
                </a>
              )}
              <button className="image-modal-action-btn image-modal-download-btn" onClick={() => downloadImage(selectedImage)}>
                <svg className="image-modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Gallery
