import React from 'react'

const MenuIcon = ({ icon, menuName, onClick, isActive }) => {
    return (
        <div className="relative group" style={{ paddingTop: '5px' }}>
            <button
                type="button"
                className={`w-8 h-8 menuIconHover ${isActive ? 'menuIconActive' : ''}`}
                onClick={onClick}
            >
                <img src={icon} alt={menuName} />
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 text-[10px] text-white bg-main-black tooltipPadding rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {menuName}
                </span>
            </button>
        </div>
    )
}

export default MenuIcon