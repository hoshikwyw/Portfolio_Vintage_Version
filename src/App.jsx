import React from 'react'
import { useState } from 'react'
import './App.css'
import MenuBar from './components/MenuBar'
import WindowFrame from './components/WindowFrame'
import { MenuProvider } from './utils/MenuContext'
import BootSplash from './components/BootSplash'

const App = () => {
  const [focusedWindow, setFocusedWindow] = useState("Home");
  const [booted, setBooted] = useState(false);

  const handleFocus = (menuName) => {
    setFocusedWindow(menuName);
  };
  return (
    <>
      {!booted && <BootSplash onFinish={() => setBooted(true)} />}
      {booted && (

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
      )}
    </>
  )
}

export default App