import React, { useContext, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MenuContext } from '../../context/MenuContext'
import StartMenu from './StartMenu'
import { Sun, Cloud, CloudRain, CloudSnow, CloudDrizzle, CloudLightning, Eye } from 'lucide-react'
import { fetchWeatherData } from '../../queries/weatherQueries'

const windowIcons = {
    'Home': 'icons/home.svg', 'Projects': 'icons/openFolder.svg',
    'Gallery': 'icons/gallery.svg', 'Send-Message': 'icons/terminal.svg',
    'Settings': 'icons/settings.svg', 'Dashboard': null,
}
const windowLabels = {
    'Home': 'About Me', 'Projects': 'Projects', 'Gallery': 'Gallery',
    'Send-Message': 'Terminal', 'Settings': 'Settings', 'Dashboard': 'Dashboard',
}

const TaskbarLockIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0" style={{ opacity: 0.6 }}>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
)

const TrayTime = () => {
    const [time, setTime] = useState(new Date())
    useEffect(() => { const i = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(i) }, [])
    const h = time.getHours() % 12 || 12, m = String(time.getMinutes()).padStart(2, '0'), ap = time.getHours() >= 12 ? 'PM' : 'AM'
    const date = time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    return (
        <div className="flex flex-col items-end leading-tight px-1">
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--os-text)' }}>{h}:{m} {ap}</span>
            <span style={{ fontSize: 9, color: 'var(--os-text-secondary)', fontWeight: 600 }}>{date}</span>
        </div>
    )
}

const TrayWeather = () => {
    const [weather, setWeather] = useState(null)
    useEffect(() => {
        const load = async (lat, lon) => { try { setWeather(await fetchWeatherData(lat, lon)) } catch {} }
        if (navigator.geolocation) navigator.geolocation.getCurrentPosition(p => load(p.coords.latitude, p.coords.longitude), () => load(51.5074, -0.1278))
        else load(51.5074, -0.1278)
    }, [])
    const getIcon = (c) => { const s = 14, l = c?.toLowerCase() || ''; if (l.includes('clear')) return <Sun size={s} />; if (l.includes('cloud')) return <Cloud size={s} />; if (l.includes('rain')) return <CloudRain size={s} />; if (l.includes('drizzle')) return <CloudDrizzle size={s} />; if (l.includes('thunder')) return <CloudLightning size={s} />; if (l.includes('snow')) return <CloudSnow size={s} />; if (l.includes('mist') || l.includes('fog')) return <Eye size={s} />; return <Sun size={s} /> }
    if (!weather) return null
    return (
        <div className="flex items-center gap-1 px-1">
            <span style={{ color: 'var(--os-accent)' }}>{getIcon(weather.weather[0].main)}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--os-text)' }}>{Math.round(weather.main.temp)}°</span>
        </div>
    )
}

const MenuBar = ({ onMenuClick }) => {
    const { openWindows, minimizedWindows, openWindow, restoreWindow } = useContext(MenuContext)
    const [startOpen, setStartOpen] = useState(false)

    const handleAppClick = (name) => {
        if (minimizedWindows.includes(name)) { restoreWindow(name); onMenuClick(name) }
        else onMenuClick(name)
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50">
            <div className="taskbar relative flex items-center h-10 px-1" style={{
                background: 'var(--os-taskbar)',
                borderTop: '2px solid var(--os-taskbar-border)',
                boxShadow: '0 -2px 8px rgba(0,0,0,0.15)',
                backdropFilter: 'var(--os-glass-blur)',
                WebkitBackdropFilter: 'var(--os-glass-blur)',
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}>
                {/* Start Button */}
                <div className="relative flex-shrink-0">
                    <motion.button
                        onClick={() => setStartOpen(!startOpen)}
                        className="flex items-center gap-1.5 h-7 px-2.5 cursor-pointer"
                        style={{
                            background: startOpen ? 'var(--os-panel-bg)' : 'var(--os-btn-bg)',
                            border: '1px solid var(--os-border-dark)',
                            borderTopColor: startOpen ? 'var(--os-border-dark)' : 'var(--os-border-light)',
                            borderLeftColor: startOpen ? 'var(--os-border-dark)' : 'var(--os-border-light)',
                            borderRadius: 'var(--os-btn-radius)',
                        }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="w-4 h-4 rounded-sm flex items-center justify-center" style={{ background: 'var(--os-accent)', borderRadius: 'var(--os-btn-radius)' }}>
                            <span className="text-white text-[8px] font-black">K</span>
                        </div>
                        <span className="text-[11px] font-bold hidden sm:inline" style={{ color: 'var(--os-text)' }}>Kayv</span>
                    </motion.button>
                    <AnimatePresence>{startOpen && <StartMenu onClose={() => setStartOpen(false)} onFocus={onMenuClick} />}</AnimatePresence>
                </div>

                {/* Divider */}
                <div className="h-6 w-[2px] mx-1 flex-shrink-0" style={{ borderLeft: '1px solid var(--os-border-dark)', borderRight: '1px solid var(--os-border-light)' }} />

                {/* Running Apps */}
                <div className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-hide px-1">
                    {openWindows.map((name) => {
                        const isMinimized = minimizedWindows.includes(name)
                        return (
                            <motion.button
                                key={name} onClick={() => handleAppClick(name)}
                                className="flex items-center gap-1.5 h-7 px-2 cursor-pointer flex-shrink-0"
                                style={{
                                    background: isMinimized ? 'var(--os-btn-bg)' : 'var(--os-panel-bg)',
                                    border: '1px solid var(--os-border-dark)',
                                    borderTopColor: isMinimized ? 'var(--os-border-light)' : 'var(--os-border-dark)',
                                    borderLeftColor: isMinimized ? 'var(--os-border-light)' : 'var(--os-border-dark)',
                                    borderRadius: 'var(--os-btn-radius)',
                                }}
                                initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {name === 'Dashboard' ? <TaskbarLockIcon /> : (
                                    <img src={windowIcons[name]} alt={name} className="w-4 h-4" style={{ filter: 'brightness(0)', opacity: isMinimized ? 0.3 : 0.6 }} />
                                )}
                                <span className="text-[10px] font-semibold hidden sm:inline" style={{ color: isMinimized ? 'var(--os-text-muted)' : 'var(--os-text)' }}>
                                    {windowLabels[name] || name}
                                </span>
                            </motion.button>
                        )
                    })}
                </div>

                {/* System Tray */}
                <div className="flex items-center flex-shrink-0 ml-1 px-2 h-7" style={{
                    borderRadius: 'var(--os-btn-radius)',
                    border: '1px solid var(--os-border-dark)',
                    borderTopColor: 'var(--os-border-dark)',
                    borderBottomColor: 'var(--os-border-light)',
                    background: 'var(--os-panel-bg)',
                }}>
                    <TrayWeather />
                    <div className="h-4 w-[1px] mx-1" style={{ borderLeft: '1px solid var(--os-border-dark)', borderRight: '1px solid var(--os-border-light)' }} />
                    <TrayTime />
                </div>
            </div>
        </div>
    )
}

export default MenuBar
