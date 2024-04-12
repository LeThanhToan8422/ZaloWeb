import Login from "./components/login/Login"
import "./App.css"
import { Toaster } from "react-hot-toast"
import { useState } from "react"

function App() {
  const [urlBackend] = useState("https://zalo-backend-team-6.onrender.com")
  // const [urlBackend] = useState("http://localhost:8080")
  return (
    <div className='app'>
      <Toaster toastOptions={{ duration: 4000 }} />
      <Login urlBackend={urlBackend}/>
    </div>
  )
}

export default App
