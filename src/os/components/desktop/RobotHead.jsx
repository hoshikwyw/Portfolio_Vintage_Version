import { useEffect, useRef } from 'react'

/** How far a pupil may slide from centre, in px. */
const PUPIL_RANGE = 3.5

/**
 * The helper bot's head — a rounded three-faced cube built with CSS 3D.
 *
 * Deliberately not three.js: a real 3D pipeline would have cost roughly
 * 200 kB gzipped, more than the entire rest of the app, for one decorative
 * element. `transform-style: preserve-3d` gives genuine depth and rotation for
 * a few hundred bytes, and the chunky low-poly result suits the retro chrome.
 *
 * Its colours come from a dedicated `--os-bot-*` palette so it stays a
 * character in every theme instead of dissolving into the button chrome.
 *
 * @param {boolean} isAwake Squares the head up and brightens the LED — used
 *   while the panel is open.
 */
const RobotHead = ({ isAwake = false }) => {
  const headRef = useRef(null)
  const eyesRef = useRef(null)

  /*
   * The eyes follow the cursor, written straight to the DOM inside a single
   * rAF rather than through state. Pointer moves fire far faster than React
   * should re-render, and this element sits on the always-mounted desktop —
   * driving it through `useState` would re-render the shell on every mouse
   * movement across the entire page.
   *
   * The transform lands on `.os-bot-pupil`; the blink animation scales the
   * `<i>` inside it, so the two never overwrite each other.
   */
  useEffect(() => {
    const eyes = eyesRef.current
    const head = headRef.current
    if (!eyes || !head) return

    // Skip for reduced motion, and for touch where there is no hovering
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
      // Normalised, so the pupils lean toward the cursor without the travel
      // depending on how far away it happens to be.
      const x = (dx / distance) * PUPIL_RANGE
      const y = (dy / distance) * PUPIL_RANGE

      for (const pupil of eyes.children) {
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
      {/* Bobs the whole head; the shadow below breathes in time with it. */}
      <span className="os-bot-float">
        <span ref={headRef} className="os-bot-head" data-awake={isAwake || undefined}>
          <span className="os-bot-antenna">
            <span className="os-bot-led" />
          </span>

          <span className="os-bot-face">
            {/* Dark screen the eyes glow out of — the main "cute" cue. */}
            <span className="os-bot-visor">
              <span ref={eyesRef} className="os-bot-eyes">
                <span className="os-bot-pupil"><i /></span>
                <span className="os-bot-pupil"><i /></span>
              </span>
            </span>

            <span className="os-bot-blush os-bot-blush-left" />
            <span className="os-bot-blush os-bot-blush-right" />
          </span>

          {/* The two faces that give the head its volume. */}
          <span className="os-bot-cheek" />
          <span className="os-bot-crown" />

          {/* Side knobs, purely to break the cube silhouette. */}
          <span className="os-bot-ear os-bot-ear-left" />
          <span className="os-bot-ear os-bot-ear-right" />
        </span>
      </span>

      <span className="os-bot-shadow" />
    </span>
  )
}

export default RobotHead
