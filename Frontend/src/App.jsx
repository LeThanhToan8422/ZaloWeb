import './App.css'
import ContentChat from './components/contentChat/ContentChat'
import ListChat from './components/listChat/ListChat'
import NavBar from './components/nav/NavBar'

function App() {
  return (
    <div className='app'>
      <NavBar/>
      <ListChat/>
      <ContentChat/>
    </div>
  )
}

export default App
