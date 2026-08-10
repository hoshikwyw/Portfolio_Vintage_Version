import { Sun, Cloud, CloudRain, CloudSnow, CloudDrizzle, CloudLightning, Eye } from 'lucide-react'
import { useClock } from '@/shared/hooks/useClock'
import { useWeather } from '@/os/hooks/useWeather'

const WEATHER_ICONS = [
  [/clear/, Sun],
  [/cloud/, Cloud],
  [/rain/, CloudRain],
  [/drizzle/, CloudDrizzle],
  [/thunder/, CloudLightning],
  [/snow/, CloudSnow],
  [/mist|fog/, Eye],
]

const WeatherIcon = ({ condition, size = 14 }) => {
  const match = WEATHER_ICONS.find(([pattern]) => pattern.test(condition?.toLowerCase() || ''))
  const Icon = match?.[1] ?? Sun
  return <Icon size={size} />
}

const TrayClock = () => {
  const time = useClock()
  const hours = time.getHours() % 12 || 12
  const minutes = String(time.getMinutes()).padStart(2, '0')
  const meridiem = time.getHours() >= 12 ? 'PM' : 'AM'
  const date = time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return (
    <div className="flex flex-col items-end leading-tight px-1">
      <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--os-text)' }}>{hours}:{minutes} {meridiem}</span>
      <span style={{ fontSize: 9, color: 'var(--os-text-secondary)', fontWeight: 600 }}>{date}</span>
    </div>
  )
}

const TrayWeather = () => {
  const { data: weather } = useWeather()
  if (!weather) return null

  return (
    <div className="flex items-center gap-1 px-1">
      <span style={{ color: 'var(--os-accent)' }}>
        <WeatherIcon condition={weather.weather?.[0]?.main} />
      </span>
      <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--os-text)' }}>{Math.round(weather.main.temp)}°</span>
    </div>
  )
}

/** Clock + weather cluster at the far end of the taskbar. */
const SystemTray = () => (
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
    <TrayClock />
  </div>
)

export default SystemTray
