import { useEffect, useState } from "react";
import NavBar from "../nav/NavBar";
import ListChat from "../listChat/ListChat";
import ContentChat from "../contentChat/ContentChat";

import "../../App.css";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";

function Home() {
  let location = useLocation();

  const [chats, setChats] = useState([]);
  const [idChat, setIdChat] = useState({});
  const [messageFinal, setMessageFinal] = useState("");
  const [searchFriends, setSearchFriends] = useState(null);
  const [displayListChat, setDisplayListChat] = useState(true);
  const [user, setUser] = useState({});
  const [rerender, setRerender] = useState(false);
  const [makeFriends, setMakeFriends] = useState([]);
  
  const [isReceiverTheCall, setIsReceiverTheCall] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);

  useEffect(() => {
    let newSocket = io(`${location.state.urlBackend}`);

    newSocket?.on(
      `Server-Reload-Page-${location.state.userId}`,
      (dataGot) => {
        dataGot.data.phone && setUser(dataGot.data)
        setRerender(pre => !pre)
      }
    );

    newSocket?.on(
      `Server-Chat-Room-${location.state.userId}`,
      (dataGot) => {
        handleChangeMessageFinal(dataGot.data);
        setRerender(pre => !pre)
      }
    );

    newSocket?.on(
      `Server-Group-Chats-${location.state.userId}`,
      (dataGot) => {
        setRerender(pre => !pre)
        if(dataGot.data.id === idChat.id  && dataGot.data.user === location.state.userId) {
          setIdChat({})
        }
        if(dataGot.data.isDissolution){
          setIdChat({})
        }
      }
    );

    newSocket?.on(
      `Server-Video-Call-${location.state.userId}`,
      (dataGot) => {
        setIsReceiverTheCall(true)
        setIsVideoCall(dataGot.data.isVideoCall)
      }
    );

    return () => {
      newSocket?.disconnect();
    };
  }, [location.state.userId, JSON.stringify(idChat), rerender, messageFinal, isReceiverTheCall]);


  useEffect(() => {
    let getApiUserById = async () => {
      let datas = await axios.get(`${location.state.urlBackend}/users/${location.state.userId}`);
      setUser(datas.data);
    };
    getApiUserById();
  }, [location.state.userId]);

  useEffect(() => {
    let getApiChatsByUserId = async () => {
      let datas = await axios.get(
        `${location.state.urlBackend}/users/get-chats-by-id/${location.state.userId}`
      );
      setChats(datas.data);
    };
    getApiChatsByUserId();
  }, [location.state.userId, JSON.stringify(idChat), rerender, messageFinal]);

  useEffect(() => {
    let getApiMakeFriends = async () => {
      let datas = await axios.get(
        `${location.state.urlBackend}/make-friends/givers/${location.state.userId}`
      );
      setMakeFriends(datas.data);
    };
    getApiMakeFriends();
  }, [location.state.userId, JSON.stringify(idChat), rerender, messageFinal]);

  let handleChangeMessageFinal = (mess) => {
    setMessageFinal(mess);
  };

  let handleChangeChat = (value) => {
    setIdChat(value);
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
      setSearchFriends(null);
      setChats(datas.data);
    }
  };


  return (
    <div className="app">
      <NavBar 
      setDisplayListChat={setDisplayListChat}
      displayListChat={displayListChat}
      user={user} 
      setUser={setUser}
      setIdChat={setIdChat}
      urlBackend={location.state.urlBackend}
      />
      <ListChat
        displayListChat={displayListChat}
        handleChangeChat={handleChangeChat}
        chats={chats}
        userId={location.state.userId}
        messageFinal={messageFinal}
        handleChangeSearchValue={handleChangeSearchValue}
        searchFriends={searchFriends}
        setRerender={setRerender}
        urlBackend={location.state.urlBackend}
        makeFriends={makeFriends}
        setDeleteChat={setIdChat}
      />
      <ContentChat
        displayListChat={displayListChat}
        userId={location.state.userId}
        idChat={idChat}
        handleChangeMessageFinal={handleChangeMessageFinal}
        setRerender={setRerender}
        urlBackend={location.state.urlBackend}
        rerender={rerender}
        isReceiverTheCall={isReceiverTheCall}
        setIsReceiverTheCall={setIsReceiverTheCall}
        isVideoCall={isVideoCall}
      />
    </div>
  );
}

export default Home;
