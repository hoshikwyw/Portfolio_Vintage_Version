import { MIN_WINDOW_WIDTH } from '@/os/constants'

/** How close to an edge, in px, the pointer must be to arm a snap. */
const EDGE = 14

/**
 * Halves only make sense when each half can still hold a window. Below this,
 * a "half" is narrower than the frame's own minimum width, so only the top
 * edge (maximize) snaps.
 */
const canSplit = (viewport) => viewport.width >= MIN_WINDOW_WIDTH * 2

/**
 * The snap zone under the pointer while dragging a window: `left`, `right`,
 * `top` (maximize), or null.
 *
 * @param {{x:number, y:number}} point Pointer position, in page pixels.
 * @param {{width:number, height:number}} viewport The desktop area.
 */
export const snapZoneAt = (point, viewport) => {
  if (point.y <= EDGE) return 'top'
  if (!canSplit(viewport)) return null
  if (point.x <= EDGE) return 'left'
  if (point.x >= viewport.width - EDGE) return 'right'
  return null
}

/** The area a zone fills — used for both the preview and the snapped geometry. */
export const snapRect = (zone, viewport) => {
  const half = Math.round(viewport.width / 2)
  if (zone === 'left') return { x: 0, y: 0, width: half, height: viewport.height }
  if (zone === 'right') return { x: half, y: 0, width: viewport.width - half, height: viewport.height }
  return { x: 0, y: 0, width: viewport.width, height: viewport.height }
}
