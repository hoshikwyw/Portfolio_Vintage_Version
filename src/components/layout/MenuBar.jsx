import React, { useContext, useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MenuIcon from './MenuIcon'
import { MenuContext } from '../../context/MenuContext'
import DockSearch from './DockSearch'
import { Mail, Download, Sun, Cloud, CloudRain, CloudSnow, CloudDrizzle, CloudLightning, Eye } from 'lucide-react'
import { fetchWeatherData } from '../../queries/weatherQueries'

// Compact clock for the taskbar
const TaskbarClock = () => {
    const [time, setTime] = useState(new Date())

    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000)
        return () => clearInterval(interval)
    }, [])

    const hours = time.getHours() % 12 || 12
    const minutes = String(time.getMinutes()).padStart(2, '0')
    const ampm = time.getHours() >= 12 ? 'PM' : 'AM'
    const dateStr = time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

    return (
        <div className="flex flex-col items-end leading-tight">
            <span className="text-[11px] font-bold text-[#2d1b4e] tracking-wider">
                {hours}:{minutes} {ampm}
            </span>
            <span className="text-[9px] text-[#6b5b95] font-semibold">{dateStr}</span>
        </div>
    )
}

// Compact weather for the taskbar
const TaskbarWeather = () => {
    const [weather, setWeather] = useState(null)
    const [expanded, setExpanded] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const load = async (lat, lon) => {
            try {
                const data = await fetchWeatherData(lat, lon)
                setWeather(data)
            } catch { /* silent */ }
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => load(pos.coords.latitude, pos.coords.longitude),
                () => load(51.5074, -0.1278)
            )
        } else {
            load(51.5074, -0.1278)
        }
    }, [])

    // Close on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setExpanded(false)
        }
        if (expanded) document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [expanded])

    const getIcon = (condition) => {
        const s = 16
        const c = condition?.toLowerCase() || ''
        if (c.includes('clear')) return <Sun size={s} />
        if (c.includes('cloud')) return <Cloud size={s} />
        if (c.includes('rain')) return <CloudRain size={s} />
        if (c.includes('drizzle')) return <CloudDrizzle size={s} />
        if (c.includes('thunder')) return <CloudLightning size={s} />
        if (c.includes('snow')) return <CloudSnow size={s} />
        if (c.includes('mist') || c.includes('fog')) return <Eye size={s} />
        return <Sun size={s} />
    }

    if (!weather) return null

    const temp = Math.round(weather.main.temp)

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
            >
                <span className="text-[#d4af37]">{getIcon(weather.weather[0].main)}</span>
                <span className="text-[11px] font-bold text-[#2d1b4e]">{temp}°C</span>
            </button>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                        className="absolute bottom-full right-0 mb-3 w-56 bg-gradient-to-br from-[#faf9f6] to-[#fff8e7] rounded-xl border-[1.5px] border-black/15 shadow-[0_12px_40px_rgba(0,0,0,0.15)] p-4 z-50"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <p className="text-sm font-bold text-[#2d1b4e]">{weather.name}</p>
                                <p className="text-[10px] text-[#6b5b95] capitalize">{weather.weather[0].description}</p>
                            </div>
                            <span className="text-[#d4af37]">{getIcon(weather.weather[0].main)}</span>
                        </div>
                        <div className="text-3xl font-bold text-[#2d1b4e] mb-3">{temp}°C</div>
                        <div className="grid grid-cols-2 gap-2 text-[10px]">
                            <div className="text-[#6b5b95]">Humidity: <span className="font-bold text-[#2d1b4e]">{weather.main.humidity}%</span></div>
                            <div className="text-[#6b5b95]">Wind: <span className="font-bold text-[#2d1b4e]">{weather.wind.speed} m/s</span></div>
                            <div className="text-[#6b5b95]">Feels: <span className="font-bold text-[#2d1b4e]">{Math.round(weather.main.feels_like)}°C</span></div>
                            <div className="text-[#6b5b95]">Pressure: <span className="font-bold text-[#2d1b4e]">{weather.main.pressure}</span></div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

const MenuBar = ({ onMenuClick }) => {
    const { openWindows, minimizedWindows, openWindow, restoreWindow } = useContext(MenuContext)

    const handleMenuClick = (name) => {
        if (minimizedWindows.includes(name)) {
            restoreWindow(name)
            onMenuClick(name)
        } else if (openWindows.includes(name)) {
            onMenuClick(name) // just focus
        } else {
            openWindow(name)
            onMenuClick(name)
        }
    }

    const handleHireClick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        const email = 'khaingwutyiwin1712@gmail.com'
        const subject = 'Hire Request - Frontend Developer'
        const body = `Hello Khaing Wut Yi Win,\n\nI am interested in discussing a potential opportunity with you.\n\nProject Details:\n- Project Type:\n- Timeline:\n- Budget:\n\nPlease let me know your availability and we can schedule a call to discuss further.\n\nBest regards,\n[Your Name]`
        const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
        window.open(gmailComposeUrl, '_blank', 'noopener,noreferrer')
    }

    const handleResumeDownload = (e) => {
        e.preventDefault()
        e.stopPropagation()
        const link = document.createElement('a')
        link.href = '/KhaingWutYiWinResume.pdf'
        link.download = 'KhaingWutYiWinResume.pdf'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className='fixed bottom-2 sm:bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-[calc(100%-16px)] sm:w-auto max-w-[95vw] sm:max-w-[90vw] md:max-w-[95vw] lg:max-w-none px-0'>
            <div className='bg-[#fff8e7]/90 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(212,175,55,0.1),inset_0_1px_0_rgba(255,255,255,0.6)] border-[1.5px] border-black/20 rounded-xl sm:rounded-2xl md:rounded-3xl px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-2.5 md:py-3 lg:py-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2 md:gap-3 lg:gap-5 font-sans'>
                {/* Search Bar */}
                <div className="w-full sm:w-auto flex-shrink sm:flex-shrink-0 order-1">
                    <DockSearch />
                </div>

                {/* Divider */}
                <div className="hidden sm:block h-8 md:h-10 w-[1.5px] bg-gradient-to-b from-transparent via-black/20 to-transparent flex-shrink-0 order-2" />

                {/* Dock Icons */}
                <div className="flex gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 items-center justify-center sm:justify-start flex-shrink-0 order-3 overflow-x-auto scrollbar-hide">
                    <MenuIcon
                        icon="icons/home.svg"
                        menuName="Home"
                        isActive={openWindows.includes('Home')}
                        isMinimized={minimizedWindows.includes('Home')}
                        onClick={() => handleMenuClick('Home')}
                    />
                    <MenuIcon
                        icon="icons/openFolder.svg"
                        menuName="Projects"
                        isActive={openWindows.includes('Projects')}
                        isMinimized={minimizedWindows.includes('Projects')}
                        onClick={() => handleMenuClick('Projects')}
                    />
                    <MenuIcon
                        icon="icons/gallery.svg"
                        menuName="Gallery"
                        isActive={openWindows.includes('Gallery')}
                        isMinimized={minimizedWindows.includes('Gallery')}
                        onClick={() => handleMenuClick('Gallery')}
                    />
                    <MenuIcon
                        icon="icons/terminal.svg"
                        menuName="OS-Terminal"
                        isActive={openWindows.includes('Send-Message')}
                        isMinimized={minimizedWindows.includes('Send-Message')}
                        onClick={() => handleMenuClick('Send-Message')}
                    />
                    <MenuIcon
                        icon="icons/settings.svg"
                        menuName="Settings"
                        isActive={openWindows.includes('Settings')}
                        isMinimized={minimizedWindows.includes('Settings')}
                        onClick={() => handleMenuClick('Settings')}
                    />
                </div>

                {/* Divider */}
                <div className="hidden sm:block h-8 md:h-10 w-[1.5px] bg-gradient-to-b from-transparent via-black/20 to-transparent flex-shrink-0 order-4" />

                {/* Action Buttons */}
                <div className="flex gap-1.5 sm:gap-2 items-center justify-center sm:justify-start flex-shrink-0 order-5">
                    <button
                        type="button"
                        onClick={handleResumeDownload}
                        className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-3.5 lg:px-4 py-1.5 sm:py-2 md:py-2.5 bg-gradient-to-br from-[#d4af37] to-[#b8941f] hover:from-[#b8941f] hover:to-[#d4af37] rounded-lg sm:rounded-xl border-[1.5px] border-[#d4af37]/50 shadow-[0_4px_12px_rgba(212,175,55,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_6px_16px_rgba(212,175,55,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] transition-all duration-300 transform hover:scale-105 active:scale-95 group whitespace-nowrap"
                    >
                        <Download size={14} className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px] text-[#2d1b4e] group-hover:animate-bounce flex-shrink-0" />
                        <span className="text-[10px] sm:text-[11px] md:text-xs text-[#2d1b4e] font-bold tracking-wider uppercase whitespace-nowrap">Resume</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleHireClick}
                        className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-3.5 lg:px-4 py-1.5 sm:py-2 md:py-2.5 bg-gradient-to-br from-[#2d1b4e] to-[#6b5b95] hover:from-[#6b5b95] hover:to-[#2d1b4e] rounded-lg sm:rounded-xl border-[1.5px] border-[#d4af37]/30 shadow-[0_4px_12px_rgba(45,27,78,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_6px_16px_rgba(45,27,78,0.4),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-300 transform hover:scale-105 active:scale-95 group whitespace-nowrap"
                    >
                        <Mail size={14} className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px] text-[#d4af37] group-hover:animate-pulse flex-shrink-0" />
                        <span className="text-[10px] sm:text-[11px] md:text-xs text-white font-bold tracking-wider uppercase whitespace-nowrap">Hire Me</span>
                    </button>
                </div>

                {/* Divider */}
                <div className="hidden md:block h-8 md:h-10 w-[1.5px] bg-gradient-to-b from-transparent via-black/20 to-transparent flex-shrink-0 order-6" />

                {/* System tray: Weather + Clock */}
                <div className="hidden md:flex items-center gap-2 flex-shrink-0 order-7">
                    <TaskbarWeather />
                    <div className="h-6 w-[1px] bg-black/10" />
                    <TaskbarClock />
                </div>
            </div>
        </div>
    )
}

export default MenuBar
