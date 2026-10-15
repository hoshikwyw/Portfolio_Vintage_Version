/**
 * Guarded access to `localStorage` / `sessionStorage`.
 *
 * Either can throw — private browsing, blocked site data, a full quota — and
 * every caller here treats persistence as best-effort, so the try/catch lives
 * in one place instead of being re-written around each read and write.
 */

const area = (session) => (session ? window.sessionStorage : window.localStorage)

/**
 * Read a raw string.
 *
 * @param {string} key
 * @param {object} [options]
 * @param {boolean} [options.session] Use sessionStorage instead of localStorage.
 * @param {*} [options.blocked] Returned when storage itself is unavailable, for
 *   callers that must tell "never set" apart from "cannot know".
 * @returns {string|null|*} The stored value, `null` if unset, or `blocked`.
 */
export const readStorage = (key, { session = false, blocked = null } = {}) => {
  try {
    return area(session).getItem(key)
  } catch {
    return blocked
  }
}

/** Read and parse JSON, falling back when unset, blocked or malformed. */
export const readStorageJSON = (key, fallback, { session = false } = {}) => {
  try {
    const raw = area(session).getItem(key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

/**
 * Write a string, or remove the key when `value` is `null`. Failures are
 * swallowed: the session keeps working, it just will not remember.
 */
export const writeStorage = (key, value, { session = false } = {}) => {
  try {
    if (value === null) area(session).removeItem(key)
    else area(session).setItem(key, value)
  } catch {
    // Best effort.
  }
}
