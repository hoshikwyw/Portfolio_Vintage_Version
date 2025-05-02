import React from 'react'

const MenuIcon = ({ icon, menuName }) => {
    return (
        <button type='button' className=' w-18 h-18'>
            <img src={icon} alt={menuName} />
        </button>
    )
}

export default MenuIcon