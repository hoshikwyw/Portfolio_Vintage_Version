import React, { createContext, useState } from 'react'

export const MenuContext = createContext()

export const MenuProvider = ({ children }) => {
    console.log('MenuProvider', children)
    const [menuName, setMenuName] = useState('Home')

    return (
        <MenuContext.Provider value={{ menuName, setMenuName }}>
            {children}
        </MenuContext.Provider>
    )
}