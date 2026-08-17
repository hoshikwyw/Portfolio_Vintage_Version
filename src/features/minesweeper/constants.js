/** Board presets, matching the sizes the original shipped with. */
export const DIFFICULTIES = [
  { key: 'beginner', label: 'Beginner', cols: 9, rows: 9, mines: 10 },
  { key: 'intermediate', label: 'Medium', cols: 16, rows: 16, mines: 40 },
  { key: 'expert', label: 'Expert', cols: 30, rows: 16, mines: 99 },
]

export const DEFAULT_DIFFICULTY = 'beginner'

/** Cap shown by the timer, so a forgotten window cannot roll it over. */
export const MAX_TIME = 999

/** localStorage key for best times, keyed by difficulty. */
export const BEST_TIMES_KEY = 'kayv-minesweeper-best'
