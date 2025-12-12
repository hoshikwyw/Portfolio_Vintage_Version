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
        <div className='fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50'>
            <div className='bg-white/95 backdrop-blur-sm shadow-[0_4px_12px_0_rgba(0,0,0,0.3)] border-2 border-[#000000] rounded-lg px-5 py-3 flex items-center gap-4 min-w-fit font-mono'>
                {/* Search Bar */}
                <DockSearch />

                {/* Divider */}
                <div className="h-10 w-[2px] bg-[#000000]"></div>

                {/* Dock Icons */}
                <div className="flex gap-2 items-center">
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
                        icon="icons/chatBox.svg"
                        menuName="OS-Assistant"
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
                <div className="h-10 w-[2px] bg-[#000000]"></div>

                {/* Date & Time */}
                <div className="flex flex-col items-end justify-center px-3 py-2 bg-[#dfdde0] rounded-sm border-2 border-[#000000] min-w-[90px]">
                    <p className="text-[10px] text-[#45473a] leading-tight font-semibold tracking-wide uppercase">{formattedDate}</p>
                    <p className="text-[12px] text-[#45473a] leading-tight font-bold">{formattedTime}</p>
                </div>
            </div>
        </div>
    )
}

export default MenuBar