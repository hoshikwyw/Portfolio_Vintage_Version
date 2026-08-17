/** Layout and stacking constants for the desktop shell. */

/** Height of the fixed taskbar, subtracted from the usable desktop area. */
export const TASKBAR_HEIGHT = 42

/** Smallest a window may be resized to. */
export const MIN_WINDOW_WIDTH = 400
export const MIN_WINDOW_HEIGHT = 300

/** Newly opened windows step down-right by this much, wrapping every N windows. */
export const WINDOW_CASCADE_STEP = 28
export const WINDOW_CASCADE_WRAP = 5

/** Fractions of the desktop a new window occupies, capped at the px values. */
export const WINDOW_INITIAL_WIDTH_RATIO = 0.55
export const WINDOW_INITIAL_HEIGHT_RATIO = 0.65
export const WINDOW_MAX_INITIAL_WIDTH = 800
export const WINDOW_MAX_INITIAL_HEIGHT = 550

/** Edges and corners that expose a resize handle. */
export const RESIZE_DIRECTIONS = [
  'top', 'right', 'bottom', 'left',
  'top-left', 'top-right', 'bottom-left', 'bottom-right',
]

/**
 * One stacking scale for the whole shell, so layers are ordered in a single
 * place instead of by scattered magic numbers.
 */
export const Z_LAYERS = {
  desktopItem: 10,
  windowLayer: 20,
  /** Unfocused windows stack from here, offset by their index. */
  window: 100,
  focusedWindow: 1000,
  taskbar: 50,
  contextMenu: 9990,
  /*
   * The helper bot floats above windows so it stays reachable, but below the
   * start menu and modal dialogs, which should be able to cover it. It is not
   * a dialog itself, so it does not borrow that layer.
   */
  helperBot: 9995,
  dialog: 9998,
  startMenu: 9999,
  fullscreenWindow: 9999,
}
