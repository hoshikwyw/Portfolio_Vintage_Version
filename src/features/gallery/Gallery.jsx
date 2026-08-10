import { useState } from 'react'
import StatusMessage from '@/shared/components/feedback/StatusMessage'
import { useProjectImages } from './hooks/useProjectImages'
import GalleryGrid from './components/GalleryGrid'
import GallerySkeleton from './components/GallerySkeleton'
import ImageLightbox from './components/ImageLightbox'
import './gallery.css'

/** Masonry gallery of project screenshots, with a click-to-zoom lightbox. */
const Gallery = () => {
  const { data: images, isLoading, isError } = useProjectImages()
  const [selectedImage, setSelectedImage] = useState(null)

  if (isLoading) return <GallerySkeleton />
  if (isError) return <StatusMessage tone="error">Error loading images</StatusMessage>
  if (!images?.length) return <StatusMessage>No images found</StatusMessage>

  return (
    <>
      <GalleryGrid images={images} onSelect={setSelectedImage} />
      {selectedImage && (
        <ImageLightbox image={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </>
  )
}

export default Gallery
