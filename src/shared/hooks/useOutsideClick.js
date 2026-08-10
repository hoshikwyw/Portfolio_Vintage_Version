import { useEffect, useRef } from 'react'

/**
 * Call `handler` when a pointer press lands outside the returned ref's element.
 *
 * @param {Function} handler Invoked on an outside press.
 * @param {boolean} [enabled] Skip the listener entirely when false.
 * @returns {import('react').RefObject} Attach to the element to guard.
 */
export const useOutsideClick = (handler, enabled = true) => {
  const ref = useRef(null)
  const handlerRef = useRef(handler)
  handlerRef.current = handler

  useEffect(() => {
    if (!enabled) return

    const onPointerDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) handlerRef.current(e)
    }

    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [enabled])

  return ref
}
