import React, { useContext, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MenuContext } from '../../context/MenuContext'
import StartMenu from './StartMenu'
import { Sun, Cloud, CloudRain, CloudSnow, CloudDrizzle, CloudLightning, Eye } from 'lucide-react'
import { fetchWeatherData } from '../../queries/weatherQueries'

const windowIcons = {
    'Home': 'icons/home.svg',
    'Projects': 'icons/openFolder.svg',
    'Gallery': 'icons/gallery.svg',
    'Send-Message': 'icons/terminal.svg',
    'Settings': 'icons/settings.svg',
}

const windowLabels = {
    'Home': 'About Me',
    'Projects': 'Projects',
    'Gallery': 'Gallery',
    'Send-Message': 'Terminal',
    'Settings': 'Settings',
}

// System tray clock
const TrayTime = () => {
    const [time, setTime] = useState(new Date())
    useEffect(() => {
        const i = setInterval(() => setTime(new Date()), 1000)
        return () => clearInterval(i)
    }, [])

    const h = time.getHours() % 12 || 12
    const m = String(time.getMinutes()).padStart(2, '0')
    const ap = time.getHours() >= 12 ? 'PM' : 'AM'
    const date = time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

    return (
        <div className="flex flex-col items-end leading-tight px-2">
            <span className="text-[11px] font-bold text-[#2d1b4e] tracking-wide">{h}:{m} {ap}</span>
            <span className="text-[9px] text-[#6b5b95] font-semibold">{date}</span>
        </div>
    )
}

// System tray weather
const TrayWeather = () => {
    const [weather, setWeather] = useState(null)
    useEffect(() => {
        const load = async (lat, lon) => {
            try { setWeather(await fetchWeatherData(lat, lon)) } catch { /* silent */ }
        }
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (p) => load(p.coords.latitude, p.coords.longitude),
                () => load(51.5074, -0.1278)
            )
        } else load(51.5074, -0.1278)
    }, [])

    const getIcon = (c) => {
        const s = 14
        const l = c?.toLowerCase() || ''
        if (l.includes('clear')) return <Sun size={s} />
        if (l.includes('cloud')) return <Cloud size={s} />
        if (l.includes('rain')) return <CloudRain size={s} />
        if (l.includes('drizzle')) return <CloudDrizzle size={s} />
        if (l.includes('thunder')) return <CloudLightning size={s} />
        if (l.includes('snow')) return <CloudSnow size={s} />
        if (l.includes('mist') || l.includes('fog')) return <Eye size={s} />
        return <Sun size={s} />
    }

    if (!weather) return null
    return (
        <div className="flex items-center gap-1 px-2">
            <span className="text-[#d4af37]">{getIcon(weather.weather[0].main)}</span>
            <span className="text-[11px] font-bold text-[#2d1b4e]">{Math.round(weather.main.temp)}°</span>
        </div>
    )
}

const MenuBar = ({ onMenuClick }) => {
    const { openWindows, minimizedWindows, openWindow, restoreWindow } = useContext(MenuContext)
    const [startOpen, setStartOpen] = useState(false)

    const handleAppClick = (name) => {
        if (minimizedWindows.includes(name)) {
            restoreWindow(name)
            onMenuClick(name)
        } else {
            onMenuClick(name) // just focus
        }
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-1 pb-1">
            <div className="taskbar relative flex items-center h-11 bg-[#fff8e7]/92 backdrop-blur-xl border-t-[1.5px] border-black/10 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] rounded-t-xl sm:rounded-t-2xl font-sans px-1">

                {/* Start Button */}
                <div className="relative flex-shrink-0">
                    <motion.button
                        onClick={() => setStartOpen(!startOpen)}
                        className={`flex items-center gap-2 h-8 px-3 rounded-xl transition-colors cursor-pointer ${startOpen ? 'bg-[#d4af37]/20' : 'hover:bg-black/5'}`}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#d4af37] to-[#b8941f] flex items-center justify-center shadow-sm">
                            <span className="text-[#2d1b4e] text-[9px] font-black">K</span>
                        </div>
                        <span className="text-[11px] font-bold text-[#2d1b4e] uppercase tracking-wider hidden sm:inline">Kayv</span>
                    </motion.button>

                    <AnimatePresence>
                        {startOpen && (
                            <StartMenu
                                onClose={() => setStartOpen(false)}
                                onFocus={onMenuClick}
                            />
                        )}
                    </AnimatePresence>
                </div>

                {/* Divider */}
                <div className="h-6 w-[1px] bg-black/10 mx-1 flex-shrink-0" />

                {/* Running Apps */}
                <div className="flex-1 flex items-center gap-0.5 overflow-x-auto scrollbar-hide px-1">
                    {openWindows.map((name) => {
                        const isMinimized = minimizedWindows.includes(name)
                        return (
                            <motion.button
                                key={name}
                                onClick={() => handleAppClick(name)}
                                className={`flex items-center gap-1.5 h-8 px-2.5 rounded-lg transition-all cursor-pointer flex-shrink-0 ${
                                    isMinimized
                                        ? 'bg-black/5 hover:bg-black/8'
                                        : 'bg-[#d4af37]/15 hover:bg-[#d4af37]/25 border border-[#d4af37]/20'
                                }`}
                                initial={{ opacity: 0, scale: 0.8, width: 0 }}
                                animate={{ opacity: 1, scale: 1, width: 'auto' }}
                                exit={{ opacity: 0, scale: 0.8, width: 0 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                whileHover={{ y: -1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <img
                                    src={windowIcons[name]}
                                    alt={name}
                                    className={`w-4 h-4 filter brightness-0 ${isMinimized ? 'opacity-40' : 'opacity-70'}`}
                                />
                                <span className={`text-[10px] font-semibold tracking-wide hidden sm:inline ${
                                    isMinimized ? 'text-[#6b5b95]/60' : 'text-[#2d1b4e]'
                                }`}>
                                    {windowLabels[name] || name}
                                </span>
                            </motion.button>
                        )
                    })}
                </div>

                {/* System Tray */}
                <div className="flex items-center flex-shrink-0 border-l border-black/10 ml-1">
                    <TrayWeather />
                    <div className="h-5 w-[1px] bg-black/8" />
                    <TrayTime />
                </div>
            </div>
        </div>
    )
}

export default MenuBar
