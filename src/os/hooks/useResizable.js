import { useCallback, useEffect, useRef } from 'react'
import { MIN_WINDOW_HEIGHT, MIN_WINDOW_WIDTH } from '@/os/constants'

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

/**
 * Edge/corner resizing for a window.
 *
 * Pointer moves are coalesced into one `requestAnimationFrame` so a fast drag
 * commits at most one geometry update per frame.
 *
 * @param {object}   params
 * @param {object}   params.geometry Current `{ x, y, width, height }`.
 * @param {object}   params.viewport Desktop area `{ width, height }`.
 * @param {Function} params.onResizeStart Called when a handle is grabbed.
 * @param {Function} params.onResize Receives the next geometry.
 * @returns {(direction: string, event: MouseEvent) => void} Handle mousedown handler.
 */
export const useResizable = ({ geometry, viewport, onResizeStart, onResize }) => {
  const dragRef = useRef(null)
  const rafRef = useRef(null)
  const teardownRef = useRef(null)

  // A drag can outlive the component (window closed mid-resize) — make sure the
  // document listeners and pending frame never leak.
  useEffect(() => () => teardownRef.current?.(), [])

  const { x, y, width, height } = geometry

  return useCallback(
    (direction, event) => {
      event.preventDefault()
      event.stopPropagation()
      onResizeStart?.()

      dragRef.current = {
        direction,
        startX: event.clientX,
        startY: event.clientY,
        originX: x,
        originY: y,
        originWidth: width,
        originHeight: height,
      }

      const handleMouseMove = (moveEvent) => {
        if (!dragRef.current) return
        if (rafRef.current) cancelAnimationFrame(rafRef.current)

        rafRef.current = requestAnimationFrame(() => {
          const drag = dragRef.current
          if (!drag) return

          const dx = moveEvent.clientX - drag.startX
          const dy = moveEvent.clientY - drag.startY
          let nextWidth = drag.originWidth
          let nextHeight = drag.originHeight
          let nextX = drag.originX
          let nextY = drag.originY

          if (drag.direction.includes('right')) {
            nextWidth = clamp(drag.originWidth + dx, MIN_WINDOW_WIDTH, viewport.width - drag.originX)
          }
          if (drag.direction.includes('left')) {
            nextWidth = clamp(drag.originWidth - dx, MIN_WINDOW_WIDTH, drag.originX + drag.originWidth)
            nextX = drag.originX + (drag.originWidth - nextWidth)
          }
          if (drag.direction.includes('bottom')) {
            nextHeight = clamp(drag.originHeight + dy, MIN_WINDOW_HEIGHT, viewport.height - drag.originY)
          }
          if (drag.direction.includes('top')) {
            nextHeight = clamp(drag.originHeight - dy, MIN_WINDOW_HEIGHT, drag.originY + drag.originHeight)
            nextY = drag.originY + (drag.originHeight - nextHeight)
          }

          onResize({
            width: nextWidth,
            height: nextHeight,
            x: Math.max(0, nextX),
            y: Math.max(0, nextY),
          })
        })
      }

      const teardown = () => {
        dragRef.current = null
        teardownRef.current = null
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', teardown)
        document.body.style.userSelect = ''
      }

      teardownRef.current = teardown
      document.body.style.userSelect = 'none'
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', teardown)
    },
    [x, y, width, height, viewport, onResizeStart, onResize],
  )
}
