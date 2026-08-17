import { useEffect, useRef } from 'react'

/** How far a pupil may slide from centre, in px. */
const PUPIL_RANGE = 3

/**
 * The helper bot's head — a chunky three-faced cube built with CSS 3D.
 *
 * Deliberately not three.js: a real 3D pipeline would have cost roughly
 * 200 kB gzipped, more than the entire rest of the app, for one decorative
 * element. `transform-style: preserve-3d` gives genuine depth and rotation for
 * a few hundred bytes, and the chunky low-poly result suits the retro chrome
 * better than a smooth rendered head would.
 *
 * @param {boolean} isAwake Raises the brow and brightens the LED — used while
 *   the panel is open or the bot has something new to say.
 */
const RobotHead = ({ isAwake = false }) => {
  const headRef = useRef(null)
  const pupilsRef = useRef(null)

  /*
   * The eyes follow the cursor, written straight to the DOM inside a single
   * rAF rather than through state. Pointer moves fire far faster than React
   * should re-render, and this element sits on the always-mounted desktop —
   * driving it through `useState` would re-render the shell on every mouse
   * movement across the entire page.
   */
  useEffect(() => {
    const pupils = pupilsRef.current
    const head = headRef.current
    if (!pupils || !head) return

    // Skip entirely for reduced motion and for touch, where there is no hover
    // cursor to follow in the first place.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    if (reduced || coarse) return

    let frame = null
    let pointer = { x: 0, y: 0 }

    const apply = () => {
      frame = null
      const box = head.getBoundingClientRect()
      const dx = pointer.x - (box.left + box.width / 2)
      const dy = pointer.y - (box.top + box.height / 2)
      const distance = Math.hypot(dx, dy) || 1
      // Normalised direction, so the pupils lean toward the cursor without
      // the travel depending on how far away it is.
      const x = (dx / distance) * PUPIL_RANGE
      const y = (dy / distance) * PUPIL_RANGE

      for (const pupil of pupils.children) {
        pupil.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`
      }
    }

    const handleMove = (event) => {
      pointer = { x: event.clientX, y: event.clientY }
      if (frame === null) frame = requestAnimationFrame(apply)
    }

    window.addEventListener('pointermove', handleMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', handleMove)
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <span className="os-bot-stage" aria-hidden="true">
      <span ref={headRef} className="os-bot-head" data-awake={isAwake || undefined}>
        {/* Antenna sits in front of the cube so it reads above the silhouette. */}
        <span className="os-bot-antenna">
          <span className="os-bot-led" />
        </span>

        <span className="os-bot-face">
          <span ref={pupilsRef} className="os-bot-eyes">
            <span className="os-bot-pupil" />
            <span className="os-bot-pupil" />
          </span>
          <span className="os-bot-mouth" />
        </span>

        {/* The two faces that give the head its depth. */}
        <span className="os-bot-cheek" />
        <span className="os-bot-crown" />
      </span>
    </span>
  )
}

export default RobotHead
