import { useEffect, useState } from 'react'

/** Milliseconds remaining until the start of the next minute. */
const msToNextMinute = (date) => 60_000 - (date.getSeconds() * 1000 + date.getMilliseconds())

/**
 * Live clock for the system tray. Returns the current `Date`.
 *
 * Ticks once a *minute*, not once a second. The tray renders `h:mm` and a
 * date, so a one-second interval spent 59 of every 60 wake-ups re-rendering an
 * identical string.
 *
 * Each tick re-schedules onto the next minute boundary rather than using a
 * fixed interval, so the displayed minute flips as it actually changes instead
 * of drifting up to a second late — including after a background tab is
 * throttled and resumes.
 */
export const useClock = () => {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    let timeoutId

    const scheduleTick = () => {
      timeoutId = setTimeout(() => {
        setNow(new Date())
        scheduleTick()
      }, msToNextMinute(new Date()))
    }

    scheduleTick()
    return () => clearTimeout(timeoutId)
  }, [])

  return now
}
