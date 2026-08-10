import Skeleton from '@/shared/components/ui/Skeleton'

/**
 * Staggered heights so the placeholder reads as a masonry grid rather than a
 * uniform table. Cycled, so the count can change without editing these.
 */
const TILE_HEIGHTS = [180, 120, 220, 150, 200, 130, 170, 240, 140, 190, 160, 210]

/** Masonry-shaped loading state for the Gallery window. */
const GallerySkeleton = () => (
  <div
    className="w-full h-full overflow-hidden project-images-container"
    role="status"
    aria-busy="true"
    aria-label="Loading gallery"
  >
    <div className="masonry-grid">
      {TILE_HEIGHTS.map((height, i) => (
        <div key={i} className="masonry-item">
          <Skeleton h={height} radius="4px" />
        </div>
      ))}
    </div>
  </div>
)

export default GallerySkeleton
