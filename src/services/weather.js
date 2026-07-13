const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

/**
 * Fetch current weather for a coordinate from the OpenWeather API.
 * @param {number} lat Latitude
 * @param {number} lon Longitude
 * @returns {Promise<object>} OpenWeather "current weather" payload
 */
export const fetchWeatherData = async (lat, lon) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`,
  )

  if (!response.ok) throw new Error('Weather data fetch failed')

  return response.json()
}
