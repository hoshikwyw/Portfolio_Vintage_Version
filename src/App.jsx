import React from 'react'
import './App.css'
import MenuBar from './components/MenuBar'
import WindowFrame from './components/WindowFrame'
import { MenuProvider } from './utils/MenuContext'

const App = () => {
  return (
    <MenuProvider>
      <div className='mainBackground relative flex h-screen w-screen justify-center items-center'>
        <div>
          <WindowFrame />
        </div>
        <div className="fixed bottom-3 z-50 w-[97%]">
          <MenuBar />
        </div>
      </div>
    </MenuProvider>
  )
}

export default App