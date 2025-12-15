import React, { useContext, useState, useEffect } from 'react'
import MenuIcon from '../common/MenuIcon'
import { MenuContext } from '../utils/MenuContext'
import DockSearch from './DockSearch'

const MenuBar = ({ onMenuClick }) => {
    const { openWindows, openWindow } = useContext(MenuContext)
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    const handleMenuClick = (name) => {
        openWindow(name) // Open the window for the selected menu
        onMenuClick(name);
    }

    const formattedDate = currentTime.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    })
    const formattedTime = currentTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    })

    return (
        <div className='fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50'>
            <div className='bg-[#fff8e7]/90 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(212,175,55,0.1),inset_0_1px_0_rgba(255,255,255,0.6)] border-[1.5px] border-black/20 rounded-3xl px-6 py-4 flex items-center gap-5 min-w-fit font-sans'>
                {/* Search Bar */}
                <DockSearch />

                {/* Divider */}
                <div className="h-10 w-[1.5px] bg-gradient-to-b from-transparent via-black/20 to-transparent"></div>

                {/* Dock Icons */}
                <div className="flex gap-3 items-center">
                    <MenuIcon
                        icon="icons/home.svg"
                        menuName="Home"
                        isActive={openWindows.includes('Home')}
                        onClick={() => handleMenuClick('Home')}
                    />
                    <MenuIcon
                        icon="icons/openFolder.svg"
                        menuName="Projects"
                        isActive={openWindows.includes('Projects')}
                        onClick={() => handleMenuClick('Projects')}
                    />
                     <MenuIcon
                        icon="icons/gallery.svg"
                        menuName="Gallery"
                        isActive={openWindows.includes('Gallery')}
                        onClick={() => handleMenuClick('Gallery')}
                    />
                    <MenuIcon
                        icon="icons/terminal.svg"
                        menuName="OS-Terminal"
                        isActive={openWindows.includes('Send-Message')}
                        onClick={() => handleMenuClick('Send-Message')}
                    />
                    <MenuIcon
                        icon="icons/settings.svg"
                        menuName="Settings"
                        isActive={openWindows.includes('Settings')}
                        onClick={() => handleMenuClick('Settings')}
                    />
                </div>

                {/* Divider */}
                <div className="h-10 w-[1.5px] bg-gradient-to-b from-transparent via-black/20 to-transparent"></div>

                {/* Date & Time */}
                <div className="flex flex-col items-end justify-center px-4 py-2.5 bg-gradient-to-br from-[#2d1b4e] to-[#6b5b95] rounded-xl border-[1.5px] border-[#d4af37]/30 min-w-[100px] shadow-[0_4px_12px_rgba(45,27,78,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]">
                    <p className="text-[10px] text-white/90 leading-tight font-semibold tracking-wider uppercase">{formattedDate}</p>
                    <p className="text-[13px] text-white leading-tight font-bold tracking-wide">{formattedTime}</p>
                </div>
            </div>
        </div>
    )
}

export default MenuBar