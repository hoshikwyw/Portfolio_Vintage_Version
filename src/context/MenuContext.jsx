import React, { createContext, useState } from 'react'

export const MenuContext = createContext()

export const MenuProvider = ({ children }) => {
    const [openWindows, setOpenWindows] = useState([])

    const openWindow = (menuName) => {
        if (!openWindows.includes(menuName)) {
            setOpenWindows([...openWindows, menuName])
        }
    }

    const closeWindow = (menuName) => {
        setOpenWindows(openWindows.filter((name) => name !== menuName))
    }

    return (
        <MenuContext.Provider value={{ openWindows, openWindow, closeWindow }}>
            {children}
        </MenuContext.Provider>
    )
}
