import { useCallback, useEffect, useRef } from 'react'

/**
 * Focus and keyboard behaviour shared by the floating and fullscreen frames.
 *
 * Windows are deliberately *not* focus-trapped. They are non-modal — several
 * can be open at once and the desktop behind them stays usable — so trapping
 * would strand a keyboard user inside whichever one opened last. The frame
 * simply takes focus once, and Tab continues to move through the page.
 *
 * @param {string}   id      App id, passed back to `onClose`.
 * @param {Function} onClose Close handler for this window.
 * @returns {{frameRef: object, handleKeyDown: Function, handleFocus: Function}}
 */
export const useWindowA11y = ({ id, onClose, onFocus }) => {
  const frameRef = useRef(null)

  useEffect(() => {
    const opener = document.activeElement

    /*
     * Move focus into the window so a keyboard user lands in what they just
     * opened, and so Escape has somewhere to be heard. `preventScroll` because
     * the frame is positioned absolutely — without it the browser scrolls the
     * desktop trying to bring it into view.
     *
     * A window whose content autofocuses something (the terminal's prompt, the
     * start-menu search) takes focus from here a moment later: those live in a
     * lazily-loaded child, so their effect runs after this one.
     */
    frameRef.current?.focus({ preventScroll: true })

    return () => {
      // Hand focus back to whatever opened the window — the desktop icon,
      // start-menu row or taskbar button — as long as it is still on the page.
      if (opener instanceof HTMLElement && document.contains(opener)) {
        opener.focus({ preventScroll: true })
      }
    }
  }, [])

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key !== 'Escape') return
      /*
       * An overlay inside the window gets first refusal on Escape — the gallery
       * lightbox marks the event handled, so closing it does not also close the
       * window underneath.
       */
      if (event.defaultPrevented) return

      event.preventDefault()
      onClose(id)
    },
    [id, onClose],
  )

  // Tabbing into a window should raise it, exactly as clicking into it does.
  // `onFocus` bubbles in React, so this covers focus landing on any descendant.
  const handleFocus = useCallback(() => onFocus?.(id), [id, onFocus])

  return { frameRef, handleKeyDown, handleFocus }
}
