import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Home from "./components/home/Home.jsx"
import Register from "./components/register/Register.jsx"
import InfoAccount from './components/register/InfoAccount.jsx'
import ForgetPassword from "./components//forgetPassword/ForgetPassword.jsx"
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import InfoUser from './components/register/InfoUser.jsx'
import ChangePassword from './components/forgetPassword/ChangePassword.jsx'
import FormUpdatePassword from './components/nav/components/FormUpdatePassword.jsx'
import VideoCall from './components/contentChat/components/VideoCall.jsx'
import VoiceCall from './components/contentChat/components/VoiceCall.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/register-form-Info-Account' element={<InfoAccount />}/>
        <Route path='/register-form-Info-User' element={<InfoUser />}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/forget-password' element={<ForgetPassword />}/>
        <Route path='/forget-password-change' element={<ChangePassword />}/>
        <Route path='/update-password' element={<FormUpdatePassword />}/>
        <Route path='/video-call/room/:name/:roomId' element={<VideoCall />}/>
        <Route path='/voice-call/room/:name/:roomId' element={<VoiceCall />}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
