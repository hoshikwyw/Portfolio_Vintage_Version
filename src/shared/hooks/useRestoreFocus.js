import { useEffect } from 'react'

/**
 * Move focus into `ref` on mount, and hand it back on unmount to whatever had
 * it before — the button, icon or tile that opened this surface — as long as
 * that element is still on the page.
 *
 * `preventScroll` both ways: these surfaces are absolutely positioned, and the
 * browser would otherwise scroll the page trying to bring them into view.
 *
 * @param {import('react').RefObject<HTMLElement>} ref Element to focus.
 */
export const useRestoreFocus = (ref) => {
  useEffect(() => {
    const opener = document.activeElement
    ref.current?.focus({ preventScroll: true })

    return () => {
      if (opener instanceof HTMLElement && document.contains(opener)) {
        opener.focus({ preventScroll: true })
      }
    }
  }, [ref])
}
