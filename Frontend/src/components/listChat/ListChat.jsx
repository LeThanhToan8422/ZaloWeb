import { useState } from "react";
import "../../sass/ListChat.scss";

const ListChat = ({ handleChangeChat }) => {
  const [isPrioritize, setIsPrioritize] = useState(true);
  const [chats, setChats]= useState([
    {
      id : "1",
      avatar : "/slide8.png",
      receiver : "Tran",
      message : "Hello My Friend!!"
    }
  ])
  return (
    <div className="container-list-chat">
      <div className="contents-search-types">
        <div className="content-search">
          <div className="search">
            <i className="fa-solid fa-magnifying-glass icon-search"></i>
            <input
              type="text"
              placeholder="Tìm Kiếm..."
              className="input-search"
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
        {
          chats.map((chat, index) => (
            <div style={{ display: "flex", alignItems: "center" }} 
            key={index}
            onClick={() => handleChangeChat(chat.id)}
            >
          <img
            src={chat.avatar}
            style={{
              height: 45,
              width: 45,
              borderRadius: 50,
              marginTop: 10,
              marginLeft: 20,
            }}
          />
          <div style={{ flexDirection: "row" }}>
            <div style={{ marginTop: 10, fontSize: 18, marginLeft: 5 }}>
              {chat.receiver}
            </div>
            <div
              style={{
                fontSize: 15,
                marginTop: 7,
                color: "gray",
                marginLeft: 5,
              }}
            >
              {chat.message}
            </div>
          </div>
        </div>
          ))
        }
      </div>
    </div>
  );
};

export default ListChat;
