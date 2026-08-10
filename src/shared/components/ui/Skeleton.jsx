/**
 * A shimmering placeholder block.
 *
 * Purely decorative — hidden from assistive tech, which should hear the
 * surrounding live region announce "loading" instead of a pile of empty boxes.
 *
 * @param {string} [w] CSS width (default: fill the container).
 * @param {string} [h] CSS height.
 * @param {string} [radius] Border radius override.
 */
const Skeleton = ({ w = '100%', h = 12, radius, className = '', style }) => (
  <div
    aria-hidden="true"
    className={`os-skeleton ${className}`}
    style={{ width: w, height: h, borderRadius: radius, ...style }}
  />
)

/** Several stacked lines of "text", the last one short like a real paragraph. */
export const SkeletonText = ({ lines = 3, gap = 6 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap }}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} h={9} w={i === lines - 1 ? '60%' : '100%'} />
    ))}
  </div>
)

export default Skeleton
