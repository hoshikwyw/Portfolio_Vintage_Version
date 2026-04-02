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
        <div className="flex flex-col items-end leading-tight px-1">
            <span className="text-[10px] font-bold text-[#2b2b3d] tracking-wide">{h}:{m} {ap}</span>
            <span className="text-[9px] text-[#5a5a5a] font-semibold">{date}</span>
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
        <div className="flex items-center gap-1 px-1">
            <span className="text-[#5a5a7a]">{getIcon(weather.weather[0].main)}</span>
            <span className="text-[10px] font-bold text-[#2b2b3d]">{Math.round(weather.main.temp)}°</span>
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
        <div className="fixed bottom-0 left-0 right-0 z-50">
            <div className="taskbar relative flex items-center h-10 bg-gradient-to-b from-[#c0b8a8] to-[#a8a090] border-t-2 border-t-[#d8d0c0] shadow-[0_-2px_8px_rgba(0,0,0,0.2)] font-sans px-1" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>

                {/* Start Button */}
                <div className="relative flex-shrink-0">
                    <motion.button
                        onClick={() => setStartOpen(!startOpen)}
                        className={`flex items-center gap-1.5 h-7 px-2.5 border transition-colors cursor-pointer ${
                            startOpen
                                ? 'bg-gradient-to-b from-[#8a8070] to-[#a09888] border-t-[#6a6050] border-l-[#6a6050] border-b-[#c0b8a8] border-r-[#c0b8a8]'
                                : 'bg-gradient-to-b from-[#d0c8b8] to-[#b0a898] border-t-[#e0d8c8] border-l-[#e0d8c8] border-b-[#7a7060] border-r-[#7a7060] hover:brightness-105'
                        }`}
                        whileTap={{ scale: 0.98 }}
                        style={{ borderRadius: '3px' }}
                    >
                        <div className="w-4 h-4 rounded-sm bg-gradient-to-br from-[#6a5acd] to-[#4a3aad] flex items-center justify-center">
                            <span className="text-white text-[8px] font-black">K</span>
                        </div>
                        <span className="text-[11px] font-bold text-[#2b2b3d] hidden sm:inline" style={{ textShadow: '0 1px 0 rgba(255,255,255,0.4)' }}>Kayv</span>
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
                <div className="h-6 w-[2px] mx-1 flex-shrink-0" style={{ borderLeft: '1px solid #8a8070', borderRight: '1px solid #d8d0c0' }} />

                {/* Running Apps */}
                <div className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-hide px-1">
                    {openWindows.map((name) => {
                        const isMinimized = minimizedWindows.includes(name)
                        return (
                            <motion.button
                                key={name}
                                onClick={() => handleAppClick(name)}
                                className={`flex items-center gap-1.5 h-7 px-2 cursor-pointer flex-shrink-0 border ${
                                    isMinimized
                                        ? 'bg-gradient-to-b from-[#c0b8a8] to-[#b0a898] border-t-[#e0d8c8] border-l-[#e0d8c8] border-b-[#7a7060] border-r-[#7a7060]'
                                        : 'bg-gradient-to-b from-[#9a9080] to-[#b0a898] border-t-[#7a7060] border-l-[#7a7060] border-b-[#d0c8b8] border-r-[#d0c8b8]'
                                }`}
                                style={{ borderRadius: '3px' }}
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <img
                                    src={windowIcons[name]}
                                    alt={name}
                                    className={`w-4 h-4 filter brightness-0 ${isMinimized ? 'opacity-30' : 'opacity-60'}`}
                                />
                                <span className={`text-[10px] font-semibold hidden sm:inline ${
                                    isMinimized ? 'text-[#6a6a6a]' : 'text-[#2b2b3d]'
                                }`} style={{ textShadow: '0 1px 0 rgba(255,255,255,0.3)' }}>
                                    {windowLabels[name] || name}
                                </span>
                            </motion.button>
                        )
                    })}
                </div>

                {/* System Tray — sunken panel */}
                <div className="flex items-center flex-shrink-0 ml-1 px-2 h-7 border" style={{
                    borderRadius: '2px',
                    borderTop: '1px solid #8a8070',
                    borderLeft: '1px solid #8a8070',
                    borderBottom: '1px solid #d8d0c0',
                    borderRight: '1px solid #d8d0c0',
                    background: 'linear-gradient(180deg, #b0a898, #c0b8a8)',
                }}>
                    <TrayWeather />
                    <div className="h-4 w-[1px] mx-1" style={{ borderLeft: '1px solid #8a8070', borderRight: '1px solid #d8d0c0' }} />
                    <TrayTime />
                </div>
            </div>
        </div>
    )
}

export default MenuBar
