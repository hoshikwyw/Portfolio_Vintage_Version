import React from 'react'

const MenuIcon = ({ icon, menuName, onClick, isActive }) => {
    return (
        <div className="relative group cursor-pointer">
            <button
                type="button"
                className={`relative w-11 h-11 flex items-center justify-center rounded-sm transition-all duration-200 ease-out cursor-pointer border-2 ${isActive
                        ? 'bg-[#ebbd8c] shadow-[0_0_8px_rgba(235,189,140,0.6)] scale-105 border-[#000000]'
                        : 'bg-[#dfdde0] hover:bg-[#c0e692] border-[#000000] hover:scale-105'
                    }`}
                onClick={onClick}
            >
                <img
                    src={icon}
                    alt={menuName}
                    className="w-5 h-5 filter brightness-0 transition-transform duration-200"
                />
            </button>
            {/* Tooltip */}
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2.5 py-1 text-[10px] text-[#45473a] bg-[#ebbd8c] border-2 border-[#000000] rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg font-semibold uppercase tracking-wide">
                {menuName}
            </span>
        </div>
    )
}

export default MenuIcon