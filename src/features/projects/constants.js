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

/**
 * The slide's rendered width.
 *
 * `SLIDE_WIDTH` is the size we *want*; on a phone the Projects window is
 * roughly viewport-wide, and a rigid 350px slide overflowed it and clipped the
 * cards. Expressed as a CSS `min()` so the browser picks whichever fits —
 * Swiper measures the laid-out element, so `slidesPerView="auto"` still works.
 */
export const SLIDE_WIDTH_CSS = `min(${SLIDE_WIDTH}px, calc(100vw - 72px))`

/** Autoplay delay between slides, in ms. */
export const AUTOPLAY_DELAY = 3000
