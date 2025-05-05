import React, { useContext } from 'react'
import SearchBar from '../common/SearchBar'
import MenuIcon from '../common/MenuIcon'
import { MenuContext } from '../utils/MenuContext'

const MenuBar = () => {
    const { openWindows, openWindow } = useContext(MenuContext)

    const handleMenuClick = (name) => {
        openWindow(name) // Open the window for the selected menu
    }

    const currentDate = new Date()
    const formattedDate = currentDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    })
    const formattedTime = currentDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    })

    return (
        <div className='bg-dark-blue flex justify-between items-center menuBarPadding gap-52 w-full'>
            <div className=" flex gap-5 flex-row items-center">
                <SearchBar />
                <div className="flex gap-10 items-center">
                    <MenuIcon
                        icon="icons/home.svg"
                        menuName="Home"
                        isActive={openWindows.includes('Home')}
                        onClick={() => handleMenuClick('Home')}
                    />
                    <MenuIcon
                        icon="icons/chatBox.svg"
                        menuName="Chat"
                        isActive={openWindows.includes('Chat')}
                        onClick={() => handleMenuClick('Chat')}
                    />
                    <MenuIcon
                        icon="icons/settings.svg"
                        menuName="Settings"
                        isActive={openWindows.includes('Settings')}
                        onClick={() => handleMenuClick('Settings')}
                    />
                    <MenuIcon
                        icon="icons/openFolder.svg"
                        menuName="Folders"
                        isActive={openWindows.includes('Folders')}
                        onClick={() => handleMenuClick('Folders')}
                    />
                </div>

            </div>
            <div className=" flex gap-5 items-center text-main-white lg:text-[12px] md:text-[10px]">
                <p>{formattedDate}</p>
                <p>{formattedTime}</p>
            </div>
        </div>
    )
}

export default MenuBar