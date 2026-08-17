import { useCallback, useEffect, useMemo, useState } from 'react'
import { useOSWindows } from '@/os/hooks/useOS'
import {
  GUIDE_SEEN_KEY,
  GUIDE_VISITED_KEY,
  idleHints,
  windowHints,
} from '@/shared/config/guide'

const readVisited = () => {
  try {
    return new Set(JSON.parse(sessionStorage.getItem(GUIDE_VISITED_KEY) ?? '[]'))
  } catch {
    return new Set()
  }
}

const writeVisited = (visited) => {
  try {
    sessionStorage.setItem(GUIDE_VISITED_KEY, JSON.stringify([...visited]))
  } catch {
    // Best effort — the guide still works, it just forgets on reload.
  }
}

const readSeen = () => {
  try {
    return Boolean(localStorage.getItem(GUIDE_SEEN_KEY))
  } catch {
    // Treat blocked storage as "seen", so we never auto-open on every load.
    return true
  }
}

const markSeen = () => {
  try {
    localStorage.setItem(GUIDE_SEEN_KEY, '1')
  } catch {
    // Ignored; worst case the panel greets a returning visitor once more.
  }
}

/**
 * Decides what the helper bot should say right now.
 *
 * The suggestion is derived from what the visitor has actually done rather
 * than from a fixed script: the bot watches which windows have been opened and
 * proposes the first one still untouched, falling back to general hints once
 * everything has been seen.
 *
 * "Visited" is accumulated here rather than read from the window manager,
 * which only knows what is open *now* — a window that was opened and closed
 * should still count as explored. It is kept in sessionStorage so closing a
 * window does not make the bot repeat itself, while a genuinely new visit
 * starts the tour again.
 */
export const useGuide = () => {
  const { openWindows } = useOSWindows()
  const [visited, setVisited] = useState(readVisited)
  const [idleIndex, setIdleIndex] = useState(0)

  // Fold anything currently open into the visited set.
  useEffect(() => {
    if (!openWindows.length) return

    setVisited((prev) => {
      const next = new Set(prev)
      openWindows.forEach((id) => next.add(id))
      if (next.size === prev.size) return prev

      writeVisited(next)
      return next
    })
  }, [openWindows])

  const pending = useMemo(
    () => windowHints.filter((hint) => !visited.has(hint.id)),
    [visited],
  )

  const nudge = useMemo(() => {
    // Still something new to show: suggest the next one in tour order.
    if (pending.length) {
      const hint = pending[0]
      return { ...hint, remaining: pending.length, total: windowHints.length }
    }

    // Everything explored — rotate through the general hints instead.
    const hint = idleHints[idleIndex % idleHints.length]
    return { ...hint, remaining: 0, total: windowHints.length }
  }, [pending, idleIndex])

  /** Advance to the next hint. Only meaningful once the tour is finished. */
  const nextHint = useCallback(() => setIdleIndex((i) => i + 1), [])

  return {
    nudge,
    /** How many windows are left to discover, for the progress readout. */
    exploredCount: windowHints.length - pending.length,
    totalCount: windowHints.length,
    nextHint,
    hasSeenGuide: readSeen,
    markGuideSeen: markSeen,
  }
}
