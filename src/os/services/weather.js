const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const ENDPOINT = 'https://api.openweathermap.org/data/2.5/weather'

/**
 * Fetch current weather for a coordinate from the OpenWeather API.
 *
 * @param {{ lat: number, lon: number }} coords
 * @returns {Promise<object>} OpenWeather "current weather" payload
 */
export const fetchWeather = async ({ lat, lon }) => {
  const response = await fetch(`${ENDPOINT}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)

  if (!response.ok) throw new Error('Weather data fetch failed')

  return response.json()
}
