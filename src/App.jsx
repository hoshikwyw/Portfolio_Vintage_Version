import React from 'react'
import { useState } from 'react'
import './App.css'
import MenuBar from './components/MenuBar'
import WindowFrame from './components/WindowFrame'
import { MenuProvider } from './utils/MenuContext'

const App = () => {
  const [focusedWindow, setFocusedWindow] = useState(null);

  const handleFocus = (menuName) => {
    setFocusedWindow(menuName);
  };
  return (
    <MenuProvider>
      <div className='mainBackground relative flex h-screen w-screen justify-center items-center'>
        <div>
          <WindowFrame focusedWindow={focusedWindow} onFocus={handleFocus} />
        </div>
        <div className="fixed bottom-3 z-50 w-[97%]">
          <MenuBar onMenuClick={handleFocus} />
        </div>
      </div>
    </MenuProvider>
  )
}

export default App