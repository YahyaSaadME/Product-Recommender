import React from 'react'
import Home from './Components/Home'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './Components/Login'
import Signup from './Components/Signup'
export default function App() {
  return (
    <Routes>
      <Route path="/" exact Component={Home}  />
      <Route path="/login" Component={Login} />
      <Route path="/signup" Component={Signup} />
    </Routes>
  )
}
