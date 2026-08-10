import { useCallback, useEffect, useRef, useState } from 'react'
import {
  TASKBAR_HEIGHT,
  WINDOW_CASCADE_STEP,
  WINDOW_CASCADE_WRAP,
  WINDOW_INITIAL_HEIGHT_RATIO,
  WINDOW_INITIAL_WIDTH_RATIO,
  WINDOW_MAX_INITIAL_HEIGHT,
  WINDOW_MAX_INITIAL_WIDTH,
} from '@/os/constants'

/** Initial geometry for a freshly opened window, cascaded by open order. */
const cascadedGeometry = (step) => {
  const areaW = window.innerWidth
  const areaH = window.innerHeight - TASKBAR_HEIGHT
  const offset = (step % WINDOW_CASCADE_WRAP) * WINDOW_CASCADE_STEP

  const width = Math.min(areaW * WINDOW_INITIAL_WIDTH_RATIO, WINDOW_MAX_INITIAL_WIDTH)
  const height = Math.min(areaH * WINDOW_INITIAL_HEIGHT_RATIO, WINDOW_MAX_INITIAL_HEIGHT)

  return {
    width,
    height,
    x: Math.max(0, Math.min(70 + offset, areaW - width)),
    y: Math.max(0, Math.min(15 + offset, areaH - height)),
  }
}

/**
 * Per-window geometry (position + size) and fullscreen flags.
 *
 * Kept separate from `useWindowManager`: that hook owns *which* windows exist,
 * this one owns *where they sit*. Geometry is discarded when a window closes so
 * reopening it starts fresh at the next cascade position.
 *
 * @param {string[]} openWindows Ids currently open, in open order.
 */
export const useWindowLayout = (openWindows) => {
  const [geometries, setGeometries] = useState({})
  const [fullscreen, setFullscreen] = useState({})
  const cascadeStep = useRef(0)

  // Assign geometry to any window that does not have one yet.
  useEffect(() => {
    setGeometries((prev) => {
      const added = {}
      openWindows.forEach((id) => {
        if (!prev[id]) added[id] = cascadedGeometry(cascadeStep.current++)
      })
      return Object.keys(added).length ? { ...prev, ...added } : prev
    })
  }, [openWindows])

  const setGeometry = useCallback((id, geometry) => {
    setGeometries((prev) => ({ ...prev, [id]: geometry }))
  }, [])

  const forgetWindow = useCallback((id) => {
    setGeometries(({ [id]: _dropped, ...rest }) => rest)
    setFullscreen(({ [id]: _flag, ...rest }) => rest)
  }, [])

  const toggleFullscreen = useCallback((id) => {
    setFullscreen((prev) => {
      if (prev[id]) {
        const { [id]: _flag, ...rest } = prev
        return rest
      }
      return { ...prev, [id]: true }
    })
  }, [])

  const exitFullscreen = useCallback((id) => {
    setFullscreen(({ [id]: _flag, ...rest }) => rest)
  }, [])

  return {
    geometries,
    fullscreen,
    setGeometry,
    forgetWindow,
    toggleFullscreen,
    exitFullscreen,
  }
}
