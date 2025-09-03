import { MapPinIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import {
    Sun,
    Cloud,
    CloudRain,
    CloudSnow,
    CloudDrizzle,
    Wind,
    CloudLightning,
    Eye,
    Thermometer,
    Droplets,
    Gauge,
    Navigation
} from 'lucide-react';
import { fetchWeatherData } from '../queries/weatherQueries';

const WeatherWidget = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [location, setLocation] = useState(null);

    const getLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            return;
        }

        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const coords = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };
                setLocation(coords);

                try {
                    const data = await fetchWeatherData(coords.latitude, coords.longitude);
                    setWeatherData(data);
                    setLoading(false);
                } catch (err) {
                    setError(err.message);
                    setLoading(false);
                }
            },
            async () => {
                setError('Unable to retrieve location. Using default (London).');
                try {
                    const data = await fetchWeatherData(51.5074, -0.1278);
                    setWeatherData(data);
                    setLoading(false);
                } catch (err) {
                    setError(err.message);
                    setLoading(false);
                }
            }
        );
    };

    const getWeatherIcon = (condition) => {
        const iconSize = 40;
        condition = condition.toLowerCase();

        if (condition.includes('clear')) return <Sun size={iconSize} />;
        if (condition.includes('cloud')) return <Cloud size={iconSize} />;
        if (condition.includes('rain')) return <CloudRain size={iconSize} />;
        if (condition.includes('drizzle')) return <CloudDrizzle size={iconSize} />;
        if (condition.includes('thunderstorm')) return <CloudLightning size={iconSize} />;
        if (condition.includes('snow')) return <CloudSnow size={iconSize} />;
        if (condition.includes('mist') || condition.includes('fog')) return <Eye size={iconSize} />;

        return <Sun size={iconSize} />;
    };

    const formatTemp = (temp) => `${Math.round(temp)}°C`;

    useEffect(() => {
        getLocation();
        const interval = setInterval(() => {
            if (location) {
                fetchWeatherData(location.latitude, location.longitude)
                    .then((data) => setWeatherData(data))
                    .catch((err) => setError(err.message));
            }
        }, 600000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className=" w-full h-full flex items-center justify-center rounded-2xl p-6 bg-white/10 backdrop-blur-md shadow-lg border border-white/20">
                <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin">
                        <Sun size={48} />
                    </div>
                    <p className="mt-4 text-gray-100 text-sm">Loading weather data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className=" w-full h-full flex items-center justify-center rounded-2xl p-6 bg-white/10 backdrop-blur-md shadow-lg border border-white/20 text-center">
                <p className="text-red-400">{error}</p>
                <button
                    onClick={getLocation}
                    className="mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm rounded-lg transition"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!weatherData) {
        return (
            <div className=" w-full h-full flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md shadow-lg border border-white/20 text-center">
                <p className="text-gray-300">No weather data available</p>
            </div>
        );
    }

    return (
        <div style={{ padding: "12px" }} className="max-w-sm mx-auto rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl border border-white text-white">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold flex items-center gap-1">
                        <MapPinIcon className="w-5 h-5" />
                        {weatherData.name}, {weatherData.sys.country}
                    </h2>
                    <p className="text-xs text-white">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </p>
                </div>
                <div className="text-right">
                    {getWeatherIcon(weatherData.weather[0].main)}
                    <p className="text-xs capitalize text-white mt-1">{weatherData.weather[0].description}</p>
                </div>
            </div>

            {/* Temperature */}
            <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2">
                    <Thermometer size={24} />
                    <span className="text-5xl font-bold">{formatTemp(weatherData.main.temp)}</span>
                </div>
                <p className="text-xs text-gray-500">Feels like {formatTemp(weatherData.main.feels_like)}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white/20 rounded-xl flex items-center gap-2" style={{ padding: "10px" }}>
                    <Droplets size={18} />
                    <div>
                        <p className="text-xs text-gray-500">Humidity</p>
                        <p className="font-medium">{weatherData.main.humidity}%</p>
                    </div>
                </div>

                <div className="bg-white/20 rounded-xl flex items-center gap-2" style={{ padding: "10px" }}>
                    <Gauge size={18} />
                    <div>
                        <p className="text-xs text-gray-500">Pressure</p>
                        <p className="font-medium">{weatherData.main.pressure} hPa</p>
                    </div>
                </div>

                <div className="bg-white/20 rounded-xl flex items-center gap-2" style={{ padding: "10px" }}>
                    <Wind size={18} />
                    <div>
                        <p className="text-xs text-gray-500">Wind Speed</p>
                        <p className="font-medium">{weatherData.wind.speed} m/s</p>
                    </div>
                </div>

                <div className="bg-white/20 rounded-xl flex items-center gap-2" style={{ padding: "10px" }}>
                    <Navigation size={18} />
                    <div>
                        <p className="text-xs text-gray-500">Wind Dir</p>
                        <p className="font-medium">{weatherData.wind.deg}°</p>
                    </div>
                </div>
            </div>

            {/* Refresh */}
            <div className=" flex w-full justify-center items-center">
                <button
                    onClick={() => {
                        if (location) {
                            fetchWeatherData(location.latitude, location.longitude);
                        } else {
                            getLocation();
                        }
                    }}
                    className=" bg-white/40 hover:bg-white/30 rounded-lg text-sm transition text-gray-600"
                    style={{ padding: "8px 16px", marginTop: "12px" }}
                >
                    Refresh
                </button>
            </div>
        </div>
    );
};

export default WeatherWidget;
