import React, { createContext, useState, useEffect } from 'react'

export const MenuContext = createContext()

export const MenuProvider = ({ children }) => {
    const [openWindows, setOpenWindows] = useState([])
    const [minimizedWindows, setMinimizedWindows] = useState([])
    const [wallpaper, setWallpaperState] = useState(
        () => localStorage.getItem('kayv-wallpaper') || 'default'
    )
    const [theme, setThemeState] = useState(
        () => localStorage.getItem('kayv-theme') || 'classic'
    )

    // Apply theme to document
    useEffect(() => {
        if (theme === 'glass') {
            document.documentElement.setAttribute('data-theme', 'glass')
        } else {
            document.documentElement.removeAttribute('data-theme')
        }
    }, [theme])

    const openWindow = (menuName) => {
        if (!openWindows.includes(menuName)) {
            setOpenWindows((prev) => [...prev, menuName])
        }
        setMinimizedWindows((prev) => prev.filter((n) => n !== menuName))
    }

    const closeWindow = (menuName) => {
        setOpenWindows((prev) => prev.filter((n) => n !== menuName))
        setMinimizedWindows((prev) => prev.filter((n) => n !== menuName))
    }

    const minimizeWindow = (menuName) => {
        if (!minimizedWindows.includes(menuName)) {
            setMinimizedWindows((prev) => [...prev, menuName])
        }
    }

    const restoreWindow = (menuName) => {
        setMinimizedWindows((prev) => prev.filter((n) => n !== menuName))
    }

    const setWallpaper = (key) => {
        setWallpaperState(key)
        localStorage.setItem('kayv-wallpaper', key)
    }

    const setTheme = (key) => {
        setThemeState(key)
        localStorage.setItem('kayv-theme', key)
    }

    return (
        <MenuContext.Provider value={{
            openWindows, minimizedWindows,
            openWindow, closeWindow, minimizeWindow, restoreWindow,
            wallpaper, setWallpaper,
            theme, setTheme,
        }}>
            {children}
        </MenuContext.Provider>
    )
}
