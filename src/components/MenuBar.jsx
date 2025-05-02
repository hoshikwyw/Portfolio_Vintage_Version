import React, { useContext } from 'react'
import SearchBar from '../common/SearchBar'
import MenuIcon from '../common/MenuIcon'
import { MenuContext } from '../utils/MenuContext'

const MenuBar = () => {
    const { menuName, setMenuName } = useContext(MenuContext)

    const handleMenuClick = (name) => {
        console.log(`Menu clicked: ${name}`)
        setMenuName(name)
    }

    return (
        <div className='bg-dark-blue flex justify-between items-center menuBarPadding gap-52'>
            <SearchBar />
            <div className="flex gap-10 items-center">
                <MenuIcon
                    icon='icons/home.svg'
                    menuName='Home'
                    isActive={menuName === 'Home'}
                    onClick={() => handleMenuClick('Home')}
                />
                <MenuIcon
                    icon='icons/chatBox.svg'
                    menuName='Chat'
                    isActive={menuName === 'Chat'}
                    onClick={() => handleMenuClick('Chat')}
                />
                <MenuIcon
                    icon='icons/settings.svg'
                    menuName='Settings'
                    isActive={menuName === 'Settings'}
                    onClick={() => handleMenuClick('Settings')}
                />
                <MenuIcon
                    icon='icons/openFolder.svg'
                    menuName='Folders'
                    isActive={menuName === 'Folders'}
                    onClick={() => handleMenuClick('Folders')}
                />
            </div>
        </div>
    )
}

export default MenuBar