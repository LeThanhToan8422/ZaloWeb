import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Home from "./components/home/Home.jsx"
import Register from "./components/register/Register.jsx"
import InfoAccount from './components/register/InfoAccount.jsx'
import ForgetPassword from "./components//forgetPassword/ForgetPassword.jsx"
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/register-formInfoAccount' element={<InfoAccount />}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/forget-password' element={<ForgetPassword />}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
