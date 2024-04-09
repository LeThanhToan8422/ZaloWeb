import { useEffect, useState } from "react";
import NavBar from "../nav/NavBar";
import ListChat from "../listChat/ListChat";
import ContentChat from "../contentChat/ContentChat";

import "../../App.css";
import axios from "axios";
import { useLocation } from "react-router-dom";

function Home() {
  let location = useLocation();

  const [chats, setChats] = useState([]);
  const [idChat, setIdChat] = useState("");
  const [messageFinal, setMessageFinal] = useState("");
  const [searchFriends, setSearchFriends] = useState([]);
  const [chatSelected, setChatsSelected] = useState(0);
  const [user, setUser] = useState({});
  const [rerender, setRerender] = useState(false);
  const [makeFriends, setMakeFriends] = useState([]);


  useEffect(() => {
    let getApiUserById = async () => {
      let datas = await axios.get(`${location.state.urlBackend}/users/${location.state.userId}`);
      setUser(datas.data);
    };
    getApiUserById();
  }, [location.state.userId, location.state.rerender, rerender]);

  useEffect(() => {
    let getApiChatsByUserId = async () => {
      let datas = await axios.get(
        `${location.state.urlBackend}/users/get-chats-by-id/${location.state.userId}`
      );
      setChats(datas.data);
    };
    getApiChatsByUserId();
  }, [location.state.userId, idChat, rerender]);

  useEffect(() => {
    let getApiMakeFriends = async () => {
      let datas = await axios.get(
        `${location.state.urlBackend}/make-friends/givers/${location.state.userId}`
      );
      setMakeFriends(datas.data);
    };
    getApiMakeFriends();
  }, [location.state.userId, rerender]);

  let handleChangeMessageFinal = (mess) => {
    setMessageFinal(mess);
  };

  let handleChangeChat = (id) => {
    setIdChat(id);
  };

  let handleChangeSearchValue = async (value) => {
    let datas = [];
    if (value) {
      datas = await axios.get(
        `${location.state.urlBackend}/users/friends/${location.state.userId}/${value}`
      );
      setSearchFriends(datas.data);
    } else {
      datas = await axios.get(
        `${location.state.urlBackend}/users/get-chats-by-id/${location.state.userId}`
      );
      setSearchFriends([]);
      setChats(datas.data);
    }
  };

  let handleClickChatSeleted = (id) => {
    setChatsSelected(id);
  };

  return (
    <div className="app">
      <NavBar user={user} 
      urlBackend={location.state.urlBackend}
      />
      <ListChat
        handleChangeChat={handleChangeChat}
        chats={chats}
        userId={location.state.userId}
        messageFinal={messageFinal}
        handleChangeSearchValue={handleChangeSearchValue}
        searchFriends={searchFriends}
        handleClickChatSeleted={handleClickChatSeleted}
        setRerender={setRerender}
        urlBackend={location.state.urlBackend}
        makeFriends={makeFriends}
        setDeleteChat={setIdChat}
      />
      <ContentChat
        userId={location.state.userId}
        idChat={idChat}
        handleChangeMessageFinal={handleChangeMessageFinal}
        chatSelected={chatSelected}
        setRerender={setRerender}
        urlBackend={location.state.urlBackend}
      />
    </div>
  );
}

export default Home;
