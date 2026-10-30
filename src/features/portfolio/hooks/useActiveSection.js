import { useEffect, useState } from 'react'

/**
 * The id of the section being read, for highlighting its header link.
 *
 * "Being read" is the last section whose top has scrolled past a line a third
 * of the way down the viewport — or, at the very end of the page, the last
 * section, which may be too short ever to reach that line. Returns null
 * above the first one (on the hero).
 *
 * @param {import('react').RefObject<HTMLElement>} scrollerRef Any element inside the scroll container.
 * @param {string[]} ids Section ids, in page order.
 */
export const useActiveSection = (scrollerRef, ids) => {
  const [active, setActive] = useState(null)
  const key = ids.join()

  useEffect(() => {
    const scroller = scrollerRef.current?.closest('.op-root')
    if (!scroller) return undefined
    const sectionIds = key.split(',')

    let frame = 0
    const measure = () => {
      frame = 0
      const atEnd = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2
      if (atEnd) return setActive(sectionIds.at(-1))

      const line = scroller.clientHeight / 3
      let current = null
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) current = id
      }
      setActive(current)
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(measure) }

    measure()
    scroller.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      scroller.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [scrollerRef, key])

  return active
}
