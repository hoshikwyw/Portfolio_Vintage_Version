import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Cloud, CloudRain, CloudSnow, CloudDrizzle, CloudLightning, Eye } from 'lucide-react'
import { useOS } from '@/context/OSContext'
import { useClock } from '@/shared/hooks/useClock'
import { useWeather } from '@/hooks/useWeather'
import { getApp, getAppLabel } from '@/config/apps'
import { profile } from '@/shared/config/profile'
import { FONT_STACK } from '@/shared/constants/fonts'
import LockIcon from '@/shared/components/ui/LockIcon'
import StartMenu from './StartMenu'

const weatherIconFor = (condition) => {
  const size = 14
  const c = condition?.toLowerCase() || ''
  if (c.includes('clear')) return <Sun size={size} />
  if (c.includes('cloud')) return <Cloud size={size} />
  if (c.includes('rain')) return <CloudRain size={size} />
  if (c.includes('drizzle')) return <CloudDrizzle size={size} />
  if (c.includes('thunder')) return <CloudLightning size={size} />
  if (c.includes('snow')) return <CloudSnow size={size} />
  if (c.includes('mist') || c.includes('fog')) return <Eye size={size} />
  return <Sun size={size} />
}

const TrayTime = () => {
  const time = useClock()
  const h = time.getHours() % 12 || 12
  const m = String(time.getMinutes()).padStart(2, '0')
  const ap = time.getHours() >= 12 ? 'PM' : 'AM'
  const date = time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return (
    <div className="flex flex-col items-end leading-tight px-1">
      <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--os-text)' }}>{h}:{m} {ap}</span>
      <span style={{ fontSize: 9, color: 'var(--os-text-secondary)', fontWeight: 600 }}>{date}</span>
    </div>
  )
}

const TrayWeather = () => {
  const weather = useWeather()
  if (!weather) return null
  return (
    <div className="flex items-center gap-1 px-1">
      <span style={{ color: 'var(--os-accent)' }}>{weatherIconFor(weather.weather[0].main)}</span>
      <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--os-text)' }}>{Math.round(weather.main.temp)}°</span>
    </div>
  )
}

// A single running-app button in the taskbar.
const AppButton = ({ id, isMinimized, onClick }) => (
  <motion.button
    onClick={onClick}
    className="flex items-center gap-1.5 h-7 px-2 cursor-pointer flex-shrink-0"
    style={{
      background: isMinimized ? 'var(--os-btn-bg)' : 'var(--os-panel-bg)',
      border: '1px solid var(--os-border-dark)',
      borderTopColor: isMinimized ? 'var(--os-border-light)' : 'var(--os-border-dark)',
      borderLeftColor: isMinimized ? 'var(--os-border-light)' : 'var(--os-border-dark)',
      borderRadius: 'var(--os-btn-radius)',
    }}
    initial={{ opacity: 0, width: 0 }}
    animate={{ opacity: 1, width: 'auto' }}
    exit={{ opacity: 0, width: 0 }}
    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    whileTap={{ scale: 0.98 }}
  >
    {getApp(id)?.locked ? (
      <LockIcon size={16} variant="tray" />
    ) : (
      <img src={getApp(id)?.icon} alt={id} className="w-4 h-4" style={{ filter: 'brightness(0)', opacity: isMinimized ? 0.3 : 0.6 }} />
    )}
    <span className="text-[10px] font-semibold hidden sm:inline" style={{ color: isMinimized ? 'var(--os-text-muted)' : 'var(--os-text)' }}>
      {getAppLabel(id)}
    </span>
  </motion.button>
)

const Taskbar = ({ onMenuClick }) => {
  const { openWindows, minimizedWindows, restoreWindow } = useOS()
  const [startOpen, setStartOpen] = useState(false)

  const handleAppClick = (id) => {
    if (minimizedWindows.includes(id)) restoreWindow(id)
    onMenuClick(id)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div
        className="taskbar relative flex items-center h-10 px-1"
        style={{
          background: 'var(--os-taskbar)',
          borderTop: '2px solid var(--os-taskbar-border)',
          boxShadow: '0 -2px 8px rgba(0,0,0,0.15)',
          backdropFilter: 'var(--os-glass-blur)',
          WebkitBackdropFilter: 'var(--os-glass-blur)',
          fontFamily: FONT_STACK,
        }}
      >
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
            <span className="text-[11px] font-bold hidden sm:inline" style={{ color: 'var(--os-text)' }}>{profile.alias}</span>
          </motion.button>
          <AnimatePresence>{startOpen && <StartMenu onClose={() => setStartOpen(false)} onFocus={onMenuClick} />}</AnimatePresence>
        </div>

        {/* Divider */}
        <div className="h-6 w-[2px] mx-1 flex-shrink-0" style={{ borderLeft: '1px solid var(--os-border-dark)', borderRight: '1px solid var(--os-border-light)' }} />

        {/* Running Apps */}
        <div className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-hide px-1">
          {openWindows.map((id) => (
            <AppButton key={id} id={id} isMinimized={minimizedWindows.includes(id)} onClick={() => handleAppClick(id)} />
          ))}
        </div>

        {/* System Tray */}
        <div
          className="flex items-center flex-shrink-0 ml-1 px-2 h-7"
          style={{
            borderRadius: 'var(--os-btn-radius)',
            border: '1px solid var(--os-border-dark)',
            borderTopColor: 'var(--os-border-dark)',
            borderBottomColor: 'var(--os-border-light)',
            background: 'var(--os-panel-bg)',
          }}
        >
          <TrayWeather />
          <div className="h-4 w-[1px] mx-1" style={{ borderLeft: '1px solid var(--os-border-dark)', borderRight: '1px solid var(--os-border-light)' }} />
          <TrayTime />
        </div>
      </div>
    </div>
  )
}

export default Taskbar
