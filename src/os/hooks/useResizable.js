import { useCallback, useEffect, useRef } from 'react'
import { MIN_WINDOW_HEIGHT, MIN_WINDOW_WIDTH } from '@/os/constants'

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

/**
 * Edge/corner resizing for a window.
 *
 * Driven by *pointer* events, so one code path covers mouse, touch and pen.
 * It was previously bound to `mousedown`/`mousemove`/`mouseup`, which meant
 * windows could not be resized on a touch device at all — dragging worked,
 * because that goes through Framer Motion's pointer handling, so a phone
 * visitor could move a window but never resize it.
 *
 * The handle captures the pointer on press. That routes every later move to it
 * even once the finger or cursor leaves its few pixels, which is what stops a
 * fast drag from "falling off" the handle — and it is why this needs no
 * document-level listeners.
 *
 * Pointer moves are coalesced into one `requestAnimationFrame`, so a fast drag
 * commits at most one geometry update per frame.
 *
 * @param {object}   params
 * @param {object}   params.geometry Current `{ x, y, width, height }`.
 * @param {object}   params.viewport Desktop area `{ width, height }`.
 * @param {Function} params.onResizeStart Called when a handle is grabbed.
 * @param {Function} params.onResize Receives the next geometry.
 * @returns {(direction: string, event: PointerEvent) => void} Handle pointerdown handler.
 */
export const useResizable = ({ geometry, viewport, onResizeStart, onResize }) => {
  const dragRef = useRef(null)
  const rafRef = useRef(null)
  const teardownRef = useRef(null)

  // A drag can outlive the component (window closed mid-resize) — make sure the
  // listeners, the captured pointer and any pending frame never leak.
  useEffect(() => () => teardownRef.current?.(), [])

  const { x, y, width, height } = geometry

  return useCallback(
    (direction, event) => {
      // Ignore secondary mouse buttons. Touch and pen both report button 0.
      if (event.button !== 0) return

      event.preventDefault()
      event.stopPropagation()
      onResizeStart?.()

      const handle = event.currentTarget
      const { pointerId } = event

      /*
       * A window can never be smaller than the desktop it sits on. On a phone
       * the fixed 400px minimum is wider than the viewport, so without this the
       * window could not be narrowed enough to fit the screen it opened on.
       */
      const minWidth = Math.min(MIN_WINDOW_WIDTH, viewport.width)
      const minHeight = Math.min(MIN_WINDOW_HEIGHT, viewport.height)

      handle.setPointerCapture?.(pointerId)

      dragRef.current = {
        direction,
        startX: event.clientX,
        startY: event.clientY,
        originX: x,
        originY: y,
        originWidth: width,
        originHeight: height,
      }

      const handlePointerMove = (moveEvent) => {
        // With capture there is only ever one pointer here, but a second touch
        // landing on the same handle would otherwise fight the first.
        if (!dragRef.current || moveEvent.pointerId !== pointerId) return
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
            nextWidth = clamp(drag.originWidth + dx, minWidth, viewport.width - drag.originX)
          }
          if (drag.direction.includes('left')) {
            nextWidth = clamp(drag.originWidth - dx, minWidth, drag.originX + drag.originWidth)
            nextX = drag.originX + (drag.originWidth - nextWidth)
          }
          if (drag.direction.includes('bottom')) {
            nextHeight = clamp(drag.originHeight + dy, minHeight, viewport.height - drag.originY)
          }
          if (drag.direction.includes('top')) {
            nextHeight = clamp(drag.originHeight - dy, minHeight, drag.originY + drag.originHeight)
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

        // Releasing a pointer that is already gone throws, and by unmount the
        // handle may be detached entirely.
        if (handle.hasPointerCapture?.(pointerId)) handle.releasePointerCapture(pointerId)

        handle.removeEventListener('pointermove', handlePointerMove)
        handle.removeEventListener('pointerup', teardown)
        handle.removeEventListener('pointercancel', teardown)
        document.body.style.userSelect = ''
      }

      teardownRef.current = teardown
      document.body.style.userSelect = 'none'

      // Capture redirects these to the handle itself, so they belong here
      // rather than on the document.
      handle.addEventListener('pointermove', handlePointerMove)
      handle.addEventListener('pointerup', teardown)
      // Fired when the gesture is stolen — a system swipe, or the browser
      // deciding the touch is a scroll. Without it the drag state would stick.
      handle.addEventListener('pointercancel', teardown)
    },
    [x, y, width, height, viewport, onResizeStart, onResize],
  )
}
