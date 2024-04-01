import { useEffect, useState } from "react";
import "../../sass/ListChat.scss";
import axios from "axios";

const ListChat = ({
  handleChangeChat,
  chats,
  userId,
  messageFinal,
  handleChangeSearchValue,
  searchFriends,
  handleClickChatSeleted
}) => {
  const [isPrioritize, setIsPrioritize] = useState(true);
  const [chatSelected, setChatsSelected] = useState(0);
  const [rerender, setRerender] = useState(false);
  const [search, setSearch] = useState("");
  const [listChat, setListChat] = useState([]);

  useEffect(() => {
    setListChat([...chats]);
    setSearch("")
    handleChangeSearchValue("")
  }, [JSON.stringify(chats), messageFinal])

  useEffect(() => {
    if (messageFinal !== "") {
      let findMessage = chats.find(
        (c) =>
          (c.sender === messageFinal.sender ||
            c.sender === messageFinal.receiver) &&
          (c.receiver === messageFinal.sender ||
            c.receiver === messageFinal.receiver)
      );

      if(findMessage){
        findMessage.sender = messageFinal.sender;
        findMessage.receiver = messageFinal.receiver;
        findMessage.message = messageFinal.message;
      }
      handleChangeSearchValue("")
    }
    setRerender(!rerender);
  }, [JSON.stringify(messageFinal)]);

  let handleClickChat = (id) => {
    handleChangeChat(id);
    setChatsSelected(id);
    handleClickChatSeleted(id)
  };

  let handleChangeSearch = async (value) => {
    setSearch(value);
    handleChangeSearchValue(value);
  };

  return (
    <div className="container-list-chat">
      <div className="contents-search-types">
        <div className="content-search">
          <div className="search">
            <i className="fa-solid fa-magnifying-glass icon-search"></i>
            <input
              type="text"
              value={search}
              placeholder="Tìm Kiếm..."
              className="input-search"
              onChange={(e) => handleChangeSearch(e.target.value)}
            />
          </div>
          <i className="fa-solid fa-user-plus icon-user"></i>
          <i className="fa-solid fa-users icon-user"></i>
        </div>

        <div className="content-type">
          <div className="type-chat">
            <span
              className="text"
              onClick={() => setIsPrioritize(true)}
              style={{
                color: isPrioritize ? "#0068ff" : "#7c8fa6",
              }}
            >
              Ưu tiên
            </span>
            <span
              className="different text"
              onClick={() => setIsPrioritize(false)}
              style={{
                color: isPrioritize ? "#7c8fa6" : "#0068ff",
              }}
            >
              Khác
            </span>
            <span
              className="border"
              style={{
                width: isPrioritize ? "48px" : "38px",
                left: isPrioritize ? "0px" : "65px",
              }}
            ></span>
          </div>
          <div className="type-status">
            <div className="select-type">
              <span>Phân loại</span>
              <i className="fa-solid fa-angle-down"></i>
            </div>
            <i className="fa-solid fa-ellipsis"></i>
          </div>
        </div>
      </div>

      <div className="contents-chats">
        {searchFriends?.length > 0
          ? searchFriends.map((chat) => (
              <div
                className="user-chat"
                key={chat.id}
                onClick={() => handleClickChat(chat.id)}
                style={{
                  backgroundColor:
                    chatSelected === chat.id ? "#e5efff" : "white",
                }}
              >
                <img
                  src={
                    chat.image == "null"
                      ? "/public/avatardefault.png"
                      : chat.image
                  }
                  style={{
                    height: 45,
                    width: 45,
                    borderRadius: 50,
                    marginTop: 10,
                    marginLeft: 20,
                  }}
                />
                <div style={{ flexDirection: "row", marginLeft: 10 }}>
                  <div style={{ marginTop: 10, fontSize: 18, marginLeft: 5 }}>
                    {chat.name}
                  </div>
                </div>
              </div>
            ))
          : listChat.map((chat) => (
              <div
                className="user-chat"
                key={chat.id}
                onClick={() => handleClickChat(chat.id)}
                style={{
                  backgroundColor:
                    chatSelected === chat.id ? "#e5efff" : "white",
                }}
              >
                <img
                  src={
                    chat.image == "null"
                      ? "/public/avatardefault.png"
                      : chat.image
                  }
                  style={{
                    height: 45,
                    width: 45,
                    borderRadius: 50,
                    marginTop: 10,
                    marginLeft: 20,
                  }}
                />
                <div style={{ flexDirection: "row", marginLeft: 10 }}>
                  <div style={{ marginTop: 10, fontSize: 18, marginLeft: 5 }}>
                    {chat.name}
                  </div>
                  <div
                    style={{
                      fontSize: 15,
                      marginTop: 7,
                      color: "gray",
                      marginLeft: 5,
                    }}
                  >
                    <span>{chat.sender == userId ? "Bạn: " : ""}</span>
                    <span>{chat.message}</span>
                    <span>{chat.message?.length > 35 ? "..." : null}</span>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default ListChat;
