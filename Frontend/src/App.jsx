import { useState } from 'react'
import './App.css'
import ContentChat from './components/contentChat/ContentChat'
import ListChat from './components/listChat/ListChat'
import NavBar from './components/nav/NavBar'

function App() {
  const [idChat, setIdChat] = useState("")

  let handleChangeChat = (id) => {
    setIdChat(id)
  }
  return (
    <div className='app'>
      <NavBar/>
      <ListChat handleChangeChat={handleChangeChat}/>
      <ContentChat idChat={idChat}/>
    </div>
  )
}

export default App
