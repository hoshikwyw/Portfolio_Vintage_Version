import React, { createContext, useState } from 'react'

export const MenuContext = createContext()

export const MenuProvider = ({ children }) => {
    const [openWindows, setOpenWindows] = useState([]) // Array of open windows

    const openWindow = (menuName) => {
        // Check if the window is already open
        if (!openWindows.includes(menuName)) {
            setOpenWindows([...openWindows, menuName])
        }
    }

    const closeWindow = (menuName) => {
        // Remove the window from the array
        setOpenWindows(openWindows.filter((name) => name !== menuName))
    }

    return (
        <MenuContext.Provider value={{ openWindows, openWindow, closeWindow }}>
            {children}
        </MenuContext.Provider>
    )
}