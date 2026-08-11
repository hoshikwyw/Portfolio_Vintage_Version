import { useState } from 'react'

/** One masonry tile; swaps its skeleton for the image once it decodes. */
const GalleryTile = ({ image, onSelect }) => {
  const [loaded, setLoaded] = useState(false)
  const title = image.projects?.title

  return (
    <div className="masonry-item" onClick={() => onSelect(image)}>
      <div className="image-card">
        {!loaded && <div className="image-skeleton os-skeleton" />}
        <img
          src={image.image_url}
          alt={title || `Image ${image.id}`}
          className={`project-image ${loaded ? 'loaded' : ''}`}
          // Off-screen tiles in the masonry wall should not compete with the
          // visible ones for bandwidth, and decoding off the main thread keeps
          // the grid scrollable while they arrive.
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
        />
        <div className="image-label">
          <span>{title}</span>
        </div>
      </div>
    </div>
  )
}

/** Masonry grid of gallery images. */
const GalleryGrid = ({ images, onSelect }) => (
  <div className="w-full h-full overflow-y-auto project-images-container">
    <div className="masonry-grid">
      {images.map((image) => (
        <GalleryTile key={image.id} image={image} onSelect={onSelect} />
      ))}
    </div>
  </div>
)

export default GalleryGrid
