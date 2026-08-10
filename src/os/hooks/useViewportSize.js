import { useEffect, useState } from 'react'
import { TASKBAR_HEIGHT } from '@/os/constants'

const measure = () => ({
  width: window.innerWidth,
  height: window.innerHeight - TASKBAR_HEIGHT,
})

/** The desktop area available to windows — the viewport minus the taskbar. */
export const useViewportSize = () => {
  const [size, setSize] = useState(measure)

  useEffect(() => {
    const handleResize = () => setSize(measure())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return size
}
