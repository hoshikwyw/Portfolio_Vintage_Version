import { useCallback, useEffect, useRef, useState } from 'react'
import { getApp } from '@/os/config/apps'
import {
  MIN_WINDOW_HEIGHT,
  MIN_WINDOW_WIDTH,
  TASKBAR_HEIGHT,
  WINDOW_CASCADE_STEP,
  WINDOW_CASCADE_WRAP,
  WINDOW_INITIAL_HEIGHT_RATIO,
  WINDOW_INITIAL_WIDTH_RATIO,
  WINDOW_MAX_INITIAL_HEIGHT,
  WINDOW_MAX_INITIAL_WIDTH,
} from '@/os/constants'

/**
 * Initial geometry for a freshly opened window, cascaded by open order.
 *
 * @param {number} step        Open order, used for the cascade offset.
 * @param {{width:number,height:number}} [preferred]  An app's declared
 *   `initialSize`. Windows that do not declare one open at a fraction of the
 *   desktop; a declared size still gets clamped to what actually fits, so a
 *   large request cannot open a window taller than the viewport.
 */
const cascadedGeometry = (step, preferred) => {
  const areaW = window.innerWidth
  const areaH = window.innerHeight - TASKBAR_HEIGHT
  const offset = (step % WINDOW_CASCADE_WRAP) * WINDOW_CASCADE_STEP

  /*
   * The WINDOW_MAX_INITIAL_* caps bound the *ratio* default so windows do not
   * open absurdly large on a wide monitor. They deliberately do not apply to a
   * declared `initialSize` — that size was chosen to fit specific content, and
   * capping it would silently reintroduce the clipping it exists to prevent.
   */
  const wantedW = preferred?.width ?? Math.min(areaW * WINDOW_INITIAL_WIDTH_RATIO, WINDOW_MAX_INITIAL_WIDTH)
  const wantedH = preferred?.height ?? Math.min(areaH * WINDOW_INITIAL_HEIGHT_RATIO, WINDOW_MAX_INITIAL_HEIGHT)

  /*
   * Either way, never open larger than the desktop itself — nor smaller than
   * the frame's CSS `min-width`/`min-height`. On a phone the ratio default
   * (~214px) is below that floor, so the browser rendered the frame wider than
   * the width used to clamp `x` below, and the window spilled off the right
   * edge with its controls out of reach.
   */
  const width = Math.min(Math.max(wantedW, Math.min(MIN_WINDOW_WIDTH, areaW)), areaW)
  const height = Math.min(Math.max(wantedH, Math.min(MIN_WINDOW_HEIGHT, areaH)), areaH)

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
        if (!prev[id]) added[id] = cascadedGeometry(cascadeStep.current++, getApp(id)?.initialSize)
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
