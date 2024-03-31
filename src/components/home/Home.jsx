import { useEffect, useState } from "react"
import NavBar from "../nav/NavBar"
import ListChat from "../listChat/ListChat"
import ContentChat from "../contentChat/ContentChat"

import "../../App.css"
import axios from "axios"
import { useLocation } from "react-router-dom"

function Home() {
  let location = useLocation()

  const [chats, setChats] = useState([])
  const [idChat, setIdChat] = useState("")
  const [messageFinal, setMessageFinal] = useState("")
  const [searchValue, setSearchValue] = useState("")
  const [searchFriends, setSearchFriends] = useState([]);

    useEffect(() => {
        let getApiChatsByUserId = async() => {
            let datas = await axios.get(`http://localhost:8080/users/get-chats-by-id/${location.state.userId}`)
            setChats(datas.data)
        }
        getApiChatsByUserId()
    }, [location.state.userId, idChat])

    let handleChangeMessageFinal = (mess) => {
      setMessageFinal(mess)
    }

  let handleChangeChat = (id) => {
    setIdChat(id)
  }

  let handleChangeSearchValue = async(value) => {
    let datas = []
    if(value){
      datas = await axios.get(
        `http://localhost:8080/users/friends/${location.state.userId}/${value}`
      );
      setSearchFriends(datas.data)
    }
    else{
      datas = await axios.get(`http://localhost:8080/users/get-chats-by-id/${location.state.userId}`)
      setSearchFriends([])
      setChats(datas.data)
    }
    console.log(datas.data);
  }

  return (
    <div className='app'>
      <NavBar userId={location.state.userId}/>
      <ListChat 
        handleChangeChat={handleChangeChat} 
        chats={chats} 
        userId={location.state.userId} 
        messageFinal={messageFinal}
        handleChangeSearchValue={handleChangeSearchValue}
        searchFriends={searchFriends}
        />
      <ContentChat 
        userId={location.state.userId} 
        idChat={idChat} 
        handleChangeMessageFinal={handleChangeMessageFinal}/>
    </div>
  )
}

export default Home
