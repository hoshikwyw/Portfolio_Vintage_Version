import { useEffect, useState } from 'react'

/**
 * Move focus into `ref` on mount, and hand it back on unmount to whatever had
 * it before — the button, icon or tile that opened this surface — as long as
 * that element is still on the page.
 *
 * The opener is read during the first render, not in the effect. Surfaces
 * that open over content often make that content `inert` in the same commit
 * (the case-study panel does), and the browser drops focus from an inert
 * subtree at once — so by the time an effect ran, the opener had already lost
 * focus to <body>, and closing the panel stranded keyboard users there.
 *
 * `preventScroll` both ways: these surfaces are absolutely positioned, and the
 * browser would otherwise scroll the page trying to bring them into view.
 *
 * @param {import('react').RefObject<HTMLElement>} ref Element to focus.
 */
export const useRestoreFocus = (ref) => {
  const [opener] = useState(() => document.activeElement)

  useEffect(() => {
    ref.current?.focus({ preventScroll: true })

    return () => {
      // By unmount the opener's subtree is no longer inert: React removes the
      // attribute in the commit that unmounts this, before running cleanups.
      if (opener instanceof HTMLElement && document.contains(opener)) {
        opener.focus({ preventScroll: true })
      }
    }
  }, [ref, opener])
}
