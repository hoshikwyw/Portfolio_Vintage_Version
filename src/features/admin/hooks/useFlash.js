import { useCallback, useEffect, useRef, useState } from 'react'

const FLASH_DURATION = 3000

/**
 * A transient status message.
 *
 * The timeout is tracked so it can be cancelled — the previous implementation
 * left a bare `setTimeout` running, which fired `setState` after the dashboard
 * unmounted (closing the window mid-save).
 */
export const useFlash = () => {
  const [message, setMessage] = useState(null)
  const timeoutRef = useRef(null)

  const clearPending = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }

  useEffect(() => clearPending, [])

  const flash = useCallback((text, tone = 'success') => {
    clearPending()
    setMessage({ text, tone })
    timeoutRef.current = setTimeout(() => setMessage(null), FLASH_DURATION)
  }, [])

  const flashError = useCallback((error) => {
    flash(error?.message ?? String(error), 'error')
  }, [flash])

  return { message, flash, flashError }
}
