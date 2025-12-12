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
            <div className=" w-full h-full flex items-center justify-center rounded-sm p-6 bg-white/95 shadow-lg border-2 border-[#000000]">
                <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin">
                        <Sun size={48} className="text-[#5768ad]" />
                    </div>
                    <p className="mt-4 text-[#45473a] text-sm font-mono font-semibold">Loading weather data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{padding: '24px'}} className=" w-full h-full flex items-center justify-center rounded-sm bg-white/95 shadow-lg border-2 border-[#000000] text-center">
                <div className="flex flex-col items-center">
                    <p className="text-[#45473a] font-mono">{error}</p>
                    <button
                        onClick={getLocation}
                        className="mt-4 px-4 py-2 bg-[#ebbd8c] hover:bg-[#c0e692] text-[#45473a] text-sm rounded-sm border-2 border-[#000000] transition font-mono font-semibold"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!weatherData) {
        return (
            <div className=" w-full h-full flex items-center justify-center rounded-sm bg-white/95 shadow-lg border-2 border-[#000000] text-center">
                <p className="text-[#45473a] font-mono">No weather data available</p>
            </div>
        );
    }

    return (
        <div className="max-w-sm mx-auto rounded-sm bg-white/95 p-3 shadow-lg border-2 border-[#000000] text-[#45473a] font-mono">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 border-b-2 border-[#000000] pb-3">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-1 uppercase tracking-wide">
                        <MapPinIcon className="w-5 h-5" />
                        {weatherData.name}, {weatherData.sys.country}
                    </h2>
                    <p className="text-xs text-[#5768ad] font-semibold mt-1">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-[#5768ad]">
                        {getWeatherIcon(weatherData.weather[0].main)}
                    </div>
                    <p className="text-xs capitalize text-[#45473a] mt-1 font-semibold">{weatherData.weather[0].description}</p>
                </div>
            </div>

            {/* Temperature */}
            <div className="text-center mb-6 border-2 border-[#000000] rounded-sm my-4 bg-[#dfdde0]">
                <div className="flex items-center justify-center gap-2">
                    <Thermometer size={24} className="text-[#5768ad]" />
                    <span className="text-5xl font-bold text-[#45473a]">{formatTemp(weatherData.main.temp)}</span>
                </div>
                <p className="text-xs text-[#5768ad] font-semibold mt-2">Feels like {formatTemp(weatherData.main.feels_like)}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-[#dfdde0] rounded-sm border-2 border-[#000000] flex items-center gap-2" style={{ padding: "10px" }}>
                    <Droplets size={18} className="text-[#5768ad]" />
                    <div>
                        <p className="text-xs text-[#5768ad] font-semibold uppercase">Humidity</p>
                        <p className="font-bold text-[#45473a]">{weatherData.main.humidity}%</p>
                    </div>
                </div>

                <div className="bg-[#dfdde0] rounded-sm border-2 border-[#000000] flex items-center gap-2" style={{ padding: "10px" }}>
                    <Gauge size={18} className="text-[#5768ad]" />
                    <div>
                        <p className="text-xs text-[#5768ad] font-semibold uppercase">Pressure</p>
                        <p className="font-bold text-[#45473a]">{weatherData.main.pressure} hPa</p>
                    </div>
                </div>

                <div className="bg-[#dfdde0] rounded-sm border-2 border-[#000000] flex items-center gap-2" style={{ padding: "10px" }}>
                    <Wind size={18} className="text-[#5768ad]" />
                    <div>
                        <p className="text-xs text-[#5768ad] font-semibold uppercase">Wind Speed</p>
                        <p className="font-bold text-[#45473a]">{weatherData.wind.speed} m/s</p>
                    </div>
                </div>

                <div className="bg-[#dfdde0] rounded-sm border-2 border-[#000000] flex items-center gap-2" style={{ padding: "10px" }}>
                    <Navigation size={18} className="text-[#5768ad]" />
                    <div>
                        <p className="text-xs text-[#5768ad] font-semibold uppercase">Wind Dir</p>
                        <p className="font-bold text-[#45473a]">{weatherData.wind.deg}°</p>
                    </div>
                </div>
            </div>

            {/* Refresh */}
            <div className=" flex w-full justify-center items-center mt-4">
                <button
                    onClick={() => {
                        if (location) {
                            fetchWeatherData(location.latitude, location.longitude);
                        } else {
                            getLocation();
                        }
                    }}
                    className="bg-[#ebbd8c] hover:bg-[#c0e692] border-2 border-[#000000] rounded-sm text-sm transition font-mono font-semibold text-[#45473a]"
                    style={{ padding: "8px 16px" }}
                >
                    Refresh
                </button>
            </div>
        </div>
    );
};

export default WeatherWidget;
