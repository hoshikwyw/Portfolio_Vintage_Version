import React from 'react'
import SearchBar from '../common/SearchBar'
import MenuIcon from '../common/MenuIcon'

const MenuBar = () => {
    return (
        <div className=' bg-dark-blue flex justify-between items-center menuBarPadding gap-52'>
            <SearchBar />
            <div className=" flex gap-10 items-center">
                <MenuIcon icon='icons/home.svg' menuName='Home' />
                <MenuIcon icon='icons/chatBox.svg' menuName='Chat' />
                <MenuIcon icon='icons/settings.svg' menuName='Settings' />
                <MenuIcon icon='icons/openFolder.svg' menuName='Folders' />
            </div>
        </div>
    )
}

export default MenuBar