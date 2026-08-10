import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchWeather } from '@/os/services/weather'

/** London — used when geolocation is denied or unavailable. */
const FALLBACK_COORDS = { lat: 51.5074, lon: -0.1278 }

/** Weather barely moves; don't re-request it while the tab stays open. */
const WEATHER_STALE_TIME = 15 * 60 * 1000

/** Resolve the visitor's coordinates once, falling back to London. */
const useCoords = () => {
  const [coords, setCoords] = useState(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setCoords(FALLBACK_COORDS)
      return
    }

    let active = true
    navigator.geolocation.getCurrentPosition(
      (pos) => active && setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => active && setCoords(FALLBACK_COORDS),
    )

    return () => { active = false }
  }, [])

  return coords
}

/**
 * Current weather for the visitor's location, for the taskbar tray.
 *
 * Goes through React Query so the reading survives the tray unmounting and is
 * not re-fetched on every remount. It is a decorative widget — failures are
 * left to the caller, which simply renders nothing without `data`.
 */
export const useWeather = () => {
  const coords = useCoords()

  return useQuery({
    queryKey: ['weather', coords?.lat, coords?.lon],
    queryFn: () => fetchWeather(coords),
    enabled: Boolean(coords),
    staleTime: WEATHER_STALE_TIME,
    retry: false,
  })
}
