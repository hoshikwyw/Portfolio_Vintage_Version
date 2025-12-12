import React from 'react'
import { useState } from 'react'
import './App.css'
import MenuBar from './components/MenuBar'
import WindowFrame from './components/WindowFrame'
import { MenuProvider } from './utils/MenuContext'
import BootSplash from './components/BootSplash'
import { SpeedInsights } from '@vercel/speed-insights/react';
import WeatherWidget from './components/WeatherWidget'
import ClockWidget from './components/ClockWidget'

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
          <div className='bg-gradient-to-br from-[#2d1b4e] via-[#4a2c6b] via-[#6b5b95] to-[#8b7ba8] relative flex h-screen w-screen justify-center items-center'>
            <div className=" absolute inset-0 w-[280px] h-[300px] top-5 left-5 rounded-md shadow-xl">
              <WeatherWidget />
            </div>
            <div className=" absolute top-5 right-5 rounded-md shadow-xl">
              <ClockWidget />
            </div>
            <div>
              <WindowFrame focusedWindow={focusedWindow} onFocus={handleFocus} />
            </div>

            <MenuBar onMenuClick={handleFocus} />
          </div>
          <SpeedInsights />
        </MenuProvider>
      )}
    </>
  )
}

export default App