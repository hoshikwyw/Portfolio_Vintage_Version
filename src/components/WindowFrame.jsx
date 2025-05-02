import React, { useContext } from 'react'
import { MenuContext } from '../utils/MenuContext'

const WindowFrame = () => {
    const { menuName } = useContext(MenuContext)

    return (
        <div className="windowFrame">
            <h1 className="text-white text-2xl">Selected Menu: {menuName || 'None'}</h1>
        </div>
    )
}

export default WindowFrame