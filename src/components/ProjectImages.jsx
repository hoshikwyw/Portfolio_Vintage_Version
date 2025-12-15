import React, { useState, useEffect } from 'react'
import { useFetchProjectImages } from '../queries/projectImagesQueries'
import './ProjectImages.css'

const ProjectImages = () => {
    const { data: images, isLoading, isError } = useFetchProjectImages()
    const [loadedImages, setLoadedImages] = useState(new Set())
    const [selectedImage, setSelectedImage] = useState(null)

    const handleImageLoad = (id) => {
        setLoadedImages(prev => new Set([...prev, id]))
    }

    const handleImageClick = (image) => {
        setSelectedImage(image)
    }

    const handleCloseModal = () => {
        setSelectedImage(null)
    }

    const handleProjectClick = (e, projectUrl) => {
        e.stopPropagation()
        window.open(projectUrl, '_blank', 'noopener,noreferrer')
    }

    // Calculate dynamic row spans for Pinterest-like layout
    useEffect(() => {
        if (!images || images.length === 0) return;

        const calculateRowSpans = () => {
            const items = document.querySelectorAll('.masonry-item');
            items.forEach(item => {
                const img = item.querySelector('img');
                if (img && img.naturalHeight && img.naturalWidth) {
                    // Calculate row span based on image aspect ratio
                    const aspectRatio = img.naturalHeight / img.naturalWidth;
                    // Adjust the multiplier to control density
                    const rowSpan = Math.ceil(aspectRatio * 25);
                    item.style.setProperty('--row-span', rowSpan);
                }
            });
        };

        // Calculate after images load with a small delay
        const timer = setTimeout(calculateRowSpans, 100);
        
        // Recalculate on window resize
        window.addEventListener('resize', calculateRowSpans);
        
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', calculateRowSpans);
        };
    }, [images, loadedImages]);

    // Escape key handler for modal
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                handleCloseModal()
            }
        }

        if (selectedImage) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [selectedImage])

    if (isLoading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-[#2d1b4e] text-lg font-semibold">Loading images...</div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-red-500 text-lg font-semibold">Error loading images</div>
            </div>
        )
    }

    if (!images || images.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-[#2d1b4e] text-lg font-semibold">No images found</div>
            </div>
        )
    }

    return (
        <>
            <div className="w-full h-full overflow-y-auto project-images-container">
                <div className="masonry-grid">
                    {images.map((image) => (
                        <div
                            key={image.id}
                            onClick={() => handleImageClick(image)}
                            className="masonry-item group"
                            style={{ '--row-span': 30 }} // Default value
                        >
                            <div className="image-card">
                                {!loadedImages.has(image.id) && (
                                    <div className="image-skeleton"></div>
                                )}
                                <img
                                    src={image.url}
                                    alt={`Project image ${image.id}`}
                                    className={`project-image ${loadedImages.has(image.id) ? 'loaded' : ''}`}
                                    onLoad={() => handleImageLoad(image.id)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedImage && (
                <div className="image-modal-overlay" onClick={handleCloseModal}>
                    <div className="image-modal-container" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="image-modal-close"
                            onClick={handleCloseModal}
                            aria-label="Close modal"
                        >
                            ×
                        </button>
                        
                        {/* SIMPLE IMAGE ONLY - NO SIDEBAR */}
                        <div className="image-modal-image-container">
                            <img
                                src={selectedImage.url}
                                alt={`Project image ${selectedImage.id}`}
                                className="image-modal-image"
                            />
                        </div>
                        
                        {/* FLOATING ACTIONS BAR AT BOTTOM */}
                        <div className="image-modal-actions-bar">
                            <a
                                href={selectedImage.project}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => handleProjectClick(e, selectedImage.project)}
                                className="image-modal-action-btn image-modal-view-btn"
                            >
                                <svg className="image-modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                    <polyline points="15 3 21 3 21 9"></polyline>
                                    <line x1="10" y1="14" x2="21" y2="3"></line>
                                </svg>
                                View Project
                            </a>
                            <button
                                className="image-modal-action-btn image-modal-download-btn"
                                onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = selectedImage.url;
                                    link.download = `project-image-${selectedImage.id}.jpg`;
                                    link.click();
                                }}
                            >
                                <svg className="image-modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
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

export default ProjectImages