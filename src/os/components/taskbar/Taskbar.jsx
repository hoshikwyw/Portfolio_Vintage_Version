import { useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { useOSActions, useOSWindows } from '@/os/hooks/useOS'
import { getApp, getAppLabel } from '@/os/config/apps'
import { Z_LAYERS } from '@/os/constants'
import { profile } from '@/shared/config/profile'
import { FONT_STACK } from '@/shared/constants/fonts'
import LockIcon from '@/shared/components/ui/LockIcon'
import StartMenu from './StartMenu'
import SystemTray from './SystemTray'

/** A single running-app button in the taskbar. */
const AppButton = ({ id, isMinimized, onClick }) => (
  <m.button
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
    whileHover={{ y: -2, filter: 'brightness(1.08)' }}
    whileTap={{ y: 0, scale: 0.96 }}
  >
    {getApp(id)?.locked ? (
      <LockIcon size={16} variant="tray" />
    ) : (
      <img src={getApp(id)?.icon} alt="" className="w-4 h-4" style={{ filter: 'var(--os-icon-filter)', opacity: isMinimized ? 0.3 : 0.6 }} />
    )}
    <span className="text-[10px] font-semibold hidden sm:inline" style={{ color: isMinimized ? 'var(--os-text-muted)' : 'var(--os-text)' }}>
      {getAppLabel(id)}
    </span>
  </m.button>
)

const StartButton = ({ isOpen, onToggle }) => (
  <m.button
    onClick={onToggle}
    aria-haspopup="true"
    aria-expanded={isOpen}
    aria-label="Start menu"
    className="flex items-center gap-1.5 h-7 px-2.5 cursor-pointer"
    style={{
      background: isOpen ? 'var(--os-panel-bg)' : 'var(--os-btn-bg)',
      border: '1px solid var(--os-border-dark)',
      borderTopColor: isOpen ? 'var(--os-border-dark)' : 'var(--os-border-light)',
      borderLeftColor: isOpen ? 'var(--os-border-dark)' : 'var(--os-border-light)',
      borderRadius: 'var(--os-btn-radius)',
    }}
    whileHover={{ filter: 'brightness(1.08)' }}
    whileTap={{ scale: 0.95 }}
  >
    <m.div
      className="w-4 h-4 rounded-sm flex items-center justify-center"
      style={{ background: 'var(--os-accent)', borderRadius: 'var(--os-btn-radius)' }}
      // The logo tile leads the press, so the button feels physically pushed.
      animate={{ rotate: isOpen ? -8 : 0, scale: isOpen ? 1.08 : 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 22 }}
    >
      <span className="text-white text-[8px] font-black">K</span>
    </m.div>
    <span className="text-[11px] font-bold hidden sm:inline" style={{ color: 'var(--os-text)' }}>{profile.alias}</span>
  </m.button>
)

/** Start button, running-app list and system tray. */
const Taskbar = () => {
  const { openWindows, minimizedWindows } = useOSWindows()
  const { activateWindow } = useOSActions()
  const [startOpen, setStartOpen] = useState(false)

  return (
    <div className="fixed bottom-0 left-0 right-0" style={{ zIndex: Z_LAYERS.taskbar }}>
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
        <div className="relative flex-shrink-0">
          <StartButton isOpen={startOpen} onToggle={() => setStartOpen((open) => !open)} />
          <AnimatePresence>
            {startOpen && <StartMenu onClose={() => setStartOpen(false)} />}
          </AnimatePresence>
        </div>

        <div className="h-6 w-[2px] mx-1 flex-shrink-0" style={{ borderLeft: '1px solid var(--os-border-dark)', borderRight: '1px solid var(--os-border-light)' }} />

        <div className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-hide px-1">
          {openWindows.map((id) => (
            <AppButton
              key={id}
              id={id}
              isMinimized={minimizedWindows.includes(id)}
              onClick={() => activateWindow(id)}
            />
          ))}
        </div>

        <SystemTray />
      </div>
    </div>
  )
}

export default Taskbar
