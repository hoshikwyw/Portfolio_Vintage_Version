/**
 * Carousel slide size.
 *
 * These were previously computed as `Math.max(350, Math.min(100, width / 2))`
 * and `Math.max(420, Math.min(420, height / 1.3))` — both of which collapse to
 * a constant for every possible input, so the carousel has always rendered at
 * these fixed sizes. Stated plainly here rather than hidden behind dead math.
 */
export const SLIDE_WIDTH = 350
export const SLIDE_HEIGHT = 420

/** Autoplay delay between slides, in ms. */
export const AUTOPLAY_DELAY = 3000
