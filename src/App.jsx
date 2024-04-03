import Login from "./components/login/Login"
import "./App.css"
import { Toaster } from "react-hot-toast"

function App() {
  return (
    <div className='app'>
      <Toaster toastOptions={{ duration: 4000 }} />
      <Login/>
    </div>
  )
}

export default App
