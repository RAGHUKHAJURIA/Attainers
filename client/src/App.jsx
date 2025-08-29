import { useState } from 'react'
import './App.css'
import Hero from './pages/hero'
import { Route, Routes, useMatch } from "react-router-dom";


function App() {

  return (
    <div>
      <Routes>
        <Route path='/' element={<Hero />} />
      </Routes>
    </div>
  )
}

export default App
