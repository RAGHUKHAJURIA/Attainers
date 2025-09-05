import { useState } from 'react'
import './App.css'
import Hero from './pages/hero'
import { Route, Routes, useMatch } from "react-router-dom";
import { ToastContainer } from 'react-toastify'


function App() {

  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Hero />} />
      </Routes>
    </div>
  )
}

export default App
