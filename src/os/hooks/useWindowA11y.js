import { useCallback, useRef } from 'react'
import { useRestoreFocus } from '@/shared/hooks/useRestoreFocus'

/**
 * Focus and keyboard behaviour shared by the floating and fullscreen frames.
 *
 * Windows are deliberately *not* focus-trapped. They are non-modal — several
 * can be open at once and the desktop behind them stays usable — so trapping
 * would strand a keyboard user inside whichever one opened last. The frame
 * simply takes focus once, and Tab continues to move through the page.
 *
 * @param {string}   id      App id, passed back to `onClose` and `onFocus`.
 * @param {Function} onClose Close handler for this window.
 * @param {Function} [onFocus] Raises this window when focus moves into it.
 * @returns {{frameRef: object, handleKeyDown: Function, handleFocus: Function}}
 */
export const useWindowA11y = ({ id, onClose, onFocus }) => {
  const frameRef = useRef(null)

  /*
   * Move focus into the window so a keyboard user lands in what they just
   * opened, and so Escape has somewhere to be heard; on close, hand it back to
   * the desktop icon, start-menu row or taskbar button that opened it.
   *
   * A window whose content autofocuses something (the terminal's prompt, the
   * start-menu search) takes focus from here a moment later: those live in a
   * lazily-loaded child, so their effect runs after this one.
   */
  useRestoreFocus(frameRef)

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
