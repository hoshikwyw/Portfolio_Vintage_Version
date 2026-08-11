import { useEffect, useState } from 'react'
import { TASKBAR_HEIGHT } from '@/os/constants'

const measure = () => ({
  width: window.innerWidth,
  height: window.innerHeight - TASKBAR_HEIGHT,
})

/**
 * The desktop area available to windows — the viewport minus the taskbar.
 *
 * `WindowLayer` and every open window re-render on each change, so the two
 * guards below matter more than they look:
 *
 *  - Resize events fire far faster than the browser can paint. They are
 *    coalesced into one `requestAnimationFrame`, so a drag commits at most one
 *    update per frame instead of one per event.
 *  - The new size is compared against the old and the previous object returned
 *    when nothing moved. Plenty of resize events do not change these
 *    dimensions — a mobile URL bar hiding, a devtools dock, an orientation
 *    event that settles back — and each one used to allocate a fresh object
 *    and re-render the whole layer for no visible reason.
 */
export const useViewportSize = () => {
  const [size, setSize] = useState(measure)

  useEffect(() => {
    let frame = null

    const handleResize = () => {
      if (frame !== null) return
      frame = requestAnimationFrame(() => {
        frame = null
        setSize((prev) => {
          const next = measure()
          return prev.width === next.width && prev.height === next.height ? prev : next
        })
      })
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [])

  return size
}
