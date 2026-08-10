import { useEffect, useState } from 'react'

/** Live clock that re-renders every second. Returns the current `Date`. */
export const useClock = () => {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return now
}
