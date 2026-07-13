import { useEffect, useState } from 'react'
import { fetchWeatherData } from '@/services/weather'

// London — used as a fallback when geolocation is denied or unavailable.
const FALLBACK_COORDS = { lat: 51.5074, lon: -0.1278 }

/**
 * Resolve the visitor's location (with a London fallback) and load the
 * current weather once. Returns the OpenWeather payload, or null while
 * loading / on failure.
 */
export const useWeather = () => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    let active = true

    const load = async (lat, lon) => {
      try {
        const data = await fetchWeatherData(lat, lon)
        if (active) setWeather(data)
      } catch {
        // Weather is a non-critical tray widget — fail silently.
      }
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => load(pos.coords.latitude, pos.coords.longitude),
        () => load(FALLBACK_COORDS.lat, FALLBACK_COORDS.lon),
      )
    } else {
      load(FALLBACK_COORDS.lat, FALLBACK_COORDS.lon)
    }

    return () => {
      active = false
    }
  }, [])

  return weather
}
