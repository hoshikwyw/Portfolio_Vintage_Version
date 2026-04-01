import React, { createContext, useState } from 'react'

export const MenuContext = createContext()

export const MenuProvider = ({ children }) => {
    const [openWindows, setOpenWindows] = useState([])
    const [minimizedWindows, setMinimizedWindows] = useState([])
    const [wallpaper, setWallpaperState] = useState(
        () => localStorage.getItem('oro-wallpaper') || 'default'
    )

    const openWindow = (menuName) => {
        if (!openWindows.includes(menuName)) {
            setOpenWindows((prev) => [...prev, menuName])
        }
        // If it was minimized, restore it
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
        localStorage.setItem('oro-wallpaper', key)
    }

    return (
        <MenuContext.Provider value={{
            openWindows,
            minimizedWindows,
            openWindow,
            closeWindow,
            minimizeWindow,
            restoreWindow,
            wallpaper,
            setWallpaper,
        }}>
            {children}
        </MenuContext.Provider>
    )
}
