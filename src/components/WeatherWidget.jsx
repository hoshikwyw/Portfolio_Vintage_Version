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
            <div className=" w-full h-full flex items-center justify-center rounded-xl p-6 bg-gradient-to-br from-[#faf9f6] to-[#fff8e7] shadow-[0_8px_24px_rgba(0,0,0,0.08),0_2px_8px_rgba(212,175,55,0.1),inset_0_1px_0_rgba(255,255,255,0.8)] border-[1.5px] border-black/15 backdrop-blur-sm">
                <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin">
                        <Sun size={48} className="text-[#d4af37]" />
                    </div>
                    <p className="mt-4 text-[#2d1b4e] text-sm font-sans font-semibold">Loading weather data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{padding: '24px'}} className=" w-full h-full flex items-center justify-center rounded-xl bg-gradient-to-br from-[#faf9f6] to-[#fff8e7] shadow-[0_8px_24px_rgba(0,0,0,0.08),0_2px_8px_rgba(212,175,55,0.1),inset_0_1px_0_rgba(255,255,255,0.8)] border-[1.5px] border-black/15 text-center backdrop-blur-sm">
                <div className="flex flex-col items-center">
                    <p className="text-[#2d1b4e] font-sans">{error}</p>
                    <button
                        onClick={getLocation}
                        className="mt-4 px-4 py-2 bg-gradient-to-br from-[#d4af37] to-[#b8941f] hover:from-[#b8941f] hover:to-[#d4af37] text-[#2d1b4e] text-sm rounded-xl border-[1.5px] border-[#d4af37]/30 transition-all duration-300 font-sans font-semibold shadow-[0_2px_8px_rgba(212,175,55,0.2)] hover:shadow-[0_4px_12px_rgba(212,175,55,0.3)]"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!weatherData) {
        return (
            <div className=" w-full h-full flex items-center justify-center rounded-xl bg-gradient-to-br from-[#faf9f6] to-[#fff8e7] shadow-[0_8px_24px_rgba(0,0,0,0.08),0_2px_8px_rgba(212,175,55,0.1),inset_0_1px_0_rgba(255,255,255,0.8)] border-[1.5px] border-black/15 text-center backdrop-blur-sm">
                <p className="text-[#2d1b4e] font-sans">No weather data available</p>
            </div>
        );
    }

    return (
        <div className="max-w-sm mx-auto rounded-xl bg-gradient-to-br from-[#faf9f6] to-[#fff8e7] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.08),0_2px_8px_rgba(212,175,55,0.1),inset_0_1px_0_rgba(255,255,255,0.8)] border-[1.5px] border-black/15 text-[#2d1b4e] font-sans backdrop-blur-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 border-b-[1.5px] border-[#d4af37]/30 pb-3">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-1 uppercase tracking-wide">
                        <MapPinIcon className="w-5 h-5 text-[#d4af37]" />
                        {weatherData.name}, {weatherData.sys.country}
                    </h2>
                    <p className="text-xs text-[#6b5b95] font-semibold mt-1">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-[#d4af37]">
                        {getWeatherIcon(weatherData.weather[0].main)}
                    </div>
                    <p className="text-xs capitalize text-[#2d1b4e] mt-1 font-semibold">{weatherData.weather[0].description}</p>
                </div>
            </div>

            {/* Temperature */}
            <div className="text-center mb-6 border-[1.5px] border-[#d4af37]/30 rounded-xl my-4 bg-gradient-to-br from-[#f5f3ef] to-[#fff8e7] p-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-center gap-2">
                    <Thermometer size={24} className="text-[#d4af37]" />
                    <span className="text-5xl font-bold text-[#2d1b4e]">{formatTemp(weatherData.main.temp)}</span>
                </div>
                <p className="text-xs text-[#6b5b95] font-semibold mt-2">Feels like {formatTemp(weatherData.main.feels_like)}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gradient-to-br from-[#f5f3ef] to-[#fff8e7] rounded-xl border-[1.5px] border-black/10 flex items-center gap-2 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]" style={{ padding: "12px" }}>
                    <Droplets size={18} className="text-[#d4af37]" />
                    <div>
                        <p className="text-xs text-[#6b5b95] font-semibold uppercase">Humidity</p>
                        <p className="font-bold text-[#2d1b4e]">{weatherData.main.humidity}%</p>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-[#f5f3ef] to-[#fff8e7] rounded-xl border-[1.5px] border-black/10 flex items-center gap-2 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]" style={{ padding: "12px" }}>
                    <Gauge size={18} className="text-[#d4af37]" />
                    <div>
                        <p className="text-xs text-[#6b5b95] font-semibold uppercase">Pressure</p>
                        <p className="font-bold text-[#2d1b4e]">{weatherData.main.pressure} hPa</p>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-[#f5f3ef] to-[#fff8e7] rounded-xl border-[1.5px] border-black/10 flex items-center gap-2 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]" style={{ padding: "12px" }}>
                    <Wind size={18} className="text-[#d4af37]" />
                    <div>
                        <p className="text-xs text-[#6b5b95] font-semibold uppercase">Wind Speed</p>
                        <p className="font-bold text-[#2d1b4e]">{weatherData.wind.speed} m/s</p>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-[#f5f3ef] to-[#fff8e7] rounded-xl border-[1.5px] border-black/10 flex items-center gap-2 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]" style={{ padding: "12px" }}>
                    <Navigation size={18} className="text-[#d4af37]" />
                    <div>
                        <p className="text-xs text-[#6b5b95] font-semibold uppercase">Wind Dir</p>
                        <p className="font-bold text-[#2d1b4e]">{weatherData.wind.deg}°</p>
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
                    className="bg-gradient-to-br from-[#d4af37] to-[#b8941f] hover:from-[#b8941f] hover:to-[#d4af37] border-[1.5px] border-[#d4af37]/30 rounded-xl text-sm transition-all duration-300 font-sans font-semibold text-[#2d1b4e] shadow-[0_2px_8px_rgba(212,175,55,0.2)] hover:shadow-[0_4px_12px_rgba(212,175,55,0.3)]"
                    style={{ padding: "8px 16px" }}
                >
                    Refresh
                </button>
            </div>
        </div>
    );
};

export default WeatherWidget;
