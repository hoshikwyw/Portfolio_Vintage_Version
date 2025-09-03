const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

/**
 * Fetch weather data from OpenWeather API
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<any>} Weather data
 */
export const fetchWeatherData = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) throw new Error('Weather data fetch failed');

    return await response.json();
  } catch (error) {
    throw new Error('Failed to fetch weather data', error);
  }
};
