import { useState } from "react";
import "../../sass/ListChat.scss";

const ListChat = () => {
  const [isPrioritize, setIsPrioritize] = useState(true);
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

      <div className="contents-chats"></div>
    </div>
  );
};

export default ListChat;
