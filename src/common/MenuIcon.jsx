import React from 'react'

const MenuIcon = ({ icon, menuName, onClick, isActive }) => {
    return (
        <div className="relative group cursor-pointer">
            <button
                type="button"
                className={`relative w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-300 ease-out cursor-pointer border-[1.5px] ${isActive
                        ? 'bg-gradient-to-br from-[#d4af37] to-[#b8941f] shadow-[0_4px_16px_rgba(212,175,55,0.4),0_0_0_2px_rgba(212,175,55,0.2),inset_0_1px_0_rgba(255,255,255,0.3)] scale-110 border-[#d4af37]/50'
                        : 'bg-white/60 hover:bg-gradient-to-br hover:from-[#d4af37]/20 hover:to-[#d4af37]/10 border-black/15 hover:border-[#d4af37]/30 hover:scale-105 hover:shadow-[0_4px_12px_rgba(212,175,55,0.25)]'
                    }`}
                onClick={onClick}
            >
                <img
                    src={icon}
                    alt={menuName}
                    className={`w-5 h-5 transition-all duration-300 ${isActive ? 'filter brightness-0 invert' : 'filter brightness-0 opacity-70 group-hover:opacity-100'}`}
                />
            </button>
            {/* Tooltip */}
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 text-[10px] text-white bg-gradient-to-br from-[#2d1b4e] to-[#6b5b95] border-[1.5px] border-[#d4af37]/30 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-[0_4px_12px_rgba(0,0,0,0.2),0_0_0_1px_rgba(212,175,55,0.2)] font-semibold uppercase tracking-wider backdrop-blur-md">
                {menuName}
            </span>
        </div>
    )
}

export default MenuIcon