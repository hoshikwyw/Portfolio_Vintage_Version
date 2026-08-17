/**
 * Open/close motion shared by the floating and fullscreen window frames.
 *
 * Kept in one module so the two cannot drift — they previously carried their
 * own near-identical literals and had already diverged on exit duration.
 *
 * Only `opacity` and `scale` are animated. `x`/`y` are deliberately left
 * alone: `DraggableWindow` binds them to the drag motion values, and
 * animating them here would fight a drag in progress.
 */

/*
 * A long, soft tail — most of the distance is covered early and the last few
 * percent ease out slowly, which is what reads as "smooth". The previous
 * `cubic-bezier(0.2, 0, 0, 1)` decelerated so hard it arrived almost
 * instantly, turning a 4% scale change into a pop.
 */
const EASE_OUT = [0.16, 1, 0.3, 1]

/** Closing accelerates away instead — dismissal should feel decisive. */
const EASE_IN = [0.4, 0, 0.9, 1]

/*
 * Durations. The old exit was 100ms, which is below the ~150ms where motion
 * stops reading as movement and becomes an instant cut; closing a window
 * looked like it blinked out of existence. Opening is given a little longer
 * than closing, since arriving deserves more ceremony than leaving.
 */
const OPEN_DURATION = 0.28
const CLOSE_DURATION = 0.18

/**
 * Floating windows. The scale delta is deeper than the old 0.96 so the growth
 * is actually perceptible without becoming a zoom.
 */
export const floatingWindowMotion = {
  initial: { opacity: 0, scale: 0.94 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: OPEN_DURATION, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: CLOSE_DURATION, ease: EASE_IN },
  },
}

/**
 * Fullscreen windows settle *inward* from slightly oversized, so the frame
 * feels like it is resolving into place rather than growing from the middle
 * of the screen.
 */
export const fullscreenWindowMotion = {
  initial: { opacity: 0, scale: 1.02 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.26, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    scale: 1.015,
    transition: { duration: 0.16, ease: EASE_IN },
  },
}
