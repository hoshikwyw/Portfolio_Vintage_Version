import React from 'react'
import './App.css'
import MenuBar from './components/MenuBar'

const App = () => {
  return (
    <div className=' mainBackground relative flex h-screen w-screen justify-center items-center'>
      <div className=" fixed bottom-3">
        <MenuBar />
      </div>
    </div>
  )
}

export default App