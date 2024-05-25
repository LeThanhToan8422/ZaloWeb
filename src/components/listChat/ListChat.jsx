import { useEffect, useState } from "react";
import "../../sass/ListChat.scss";
import moment from "moment/moment";
import "moment/locale/vi";
import FormSearchFriendByPhone from "./components/FormSearchFriendByPhone";
import FormDeleteChat from "./components/FormDeleteChat";
import FormCreateGroup from "./components/FormCreateGroup";
import axios from "axios";

const ListChat = ({
  displayListChat,
  handleChangeChat,
  chats,
  userId,
  messageFinal,
  handleChangeSearchValue,
  searchFriends,
  setRerender,
  urlBackend,
  makeFriends,
  setDeleteChat,
}) => {
  const [isPrioritize, setIsPrioritize] = useState(true);
  const [chatSelected, setChatsSelected] = useState(0);
  const [search, setSearch] = useState("");
  const [listChat, setListChat] = useState([]);
  const [visibleFriendByPhone, setVisibleFriendByPhone] = useState(false);
  const [regexUrl] = useState(
    "https://s3-dynamodb-cloudfront-20040331.s3.ap-southeast-1.amazonaws.com/"
  );
  const [isClickUtils, setIsClickUtils] = useState(false);
  const [idChat, setIdChat] = useState("");
  const [visibleDel, setVisibleDel] = useState(false);
  const [visibleGroup, setVisibleGroup] = useState(false);

  useEffect(() => {
    // setListChat([...chats]);
    setSearch("");
    handleChangeSearchValue("");
  }, [JSON.stringify(chats)]);

  useEffect(() => {
    if (messageFinal) {
      let findMessage = chats.find(
        (c) =>
          (c.sender === messageFinal?.sender ||
            c.sender === messageFinal?.receiver) &&
          (c.receiver === messageFinal?.sender ||
            c.receiver === messageFinal?.receiver)
      );

      if (findMessage) {
        findMessage.message = messageFinal?.message;
        setRerender((pre) => !pre);
      }
    }
  }, [JSON.stringify(messageFinal)]);

  let handleClickChat = async(chat) => {
    let dateTimeSend = moment().format("YYYY-MM-DD HH:mm:ss")
    if (chat.phone) {
      await axios.post(`${urlBackend}/wait-message/update/${chat.id}/${userId}/${dateTimeSend}`)
      handleChangeChat({
        id: chat.id,
        type: "Single",
      });
      setChatsSelected({
        id: chat.id,
        type: "Single",
      });
    } else {
      await axios.post(`${urlBackend}/wait-message/update/${userId}/Group/${chat.id}/${dateTimeSend}`)
      handleChangeChat({
        id: chat.id,
        type: "Group",
      });
      setChatsSelected({
        id: chat.id,
        type: "Group",
      });
    }
  };

  let handleChangeSearch = async (value) => {
    setSearch(value);
    handleChangeSearchValue(value);
  };

  let handleClickUtils = (id) => {
    setIsClickUtils(!isClickUtils);
    setIdChat(id);
  };
  return (
    <div
      className="container-list-chat"
      style={{ display: displayListChat ? "flex" : "none" }}
    >
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
          <FormSearchFriendByPhone
            setVisible={setVisibleFriendByPhone}
            visible={visibleFriendByPhone}
            userId={userId}
            urlBackend={urlBackend}
            makeFriends={makeFriends}
            setRerender={setRerender}
          />
          <i
            className="fa-solid fa-user-plus icon-user"
            onClick={() => setVisibleFriendByPhone(true)}
          ></i>
          <span
            style={{
              color: "red",
              marginBottom: 20,
              marginLeft: -10,
              fontSize: 12,
            }}
          >
            {makeFriends?.length > 0 ? `+` + makeFriends?.length : ""}
          </span>
          <i
            className="fa-solid fa-users icon-user"
            onClick={() => setVisibleGroup(true)}
          ></i>
          {visibleGroup && (
            <FormCreateGroup
              visible={visibleGroup}
              setVisible={setVisibleGroup}
              userId={userId}
              urlBackend={urlBackend}
            />
          )}
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

      <div
        className="contents-chats"
        style={{
          height: "100%",
          overflowY: "scroll",
        }}
      >
        {searchFriends !== null
          ? searchFriends.map((chat) => (
              <div
                className="user-chat"
                key={chat.id}
                onClick={() => handleClickChat(chat)}
                style={{
                  backgroundColor:
                    chatSelected.id === chat.id ? "#e5efff" : "white",
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
          : chats?.map((chat) => (
              <div
                className="user-chat"
                key={chat.id}
                onClick={() => handleClickChat(chat)}
                style={{
                  backgroundColor:
                    chatSelected.id === chat.id ? "#e5efff" : "white",
                }}
              >
                <div style={{position : "relative"}}>
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
                  {
                    chat.quantity > 0 && <span style={{
                      position : "absolute",
                      bottom : -15,
                      right : 0,
                      padding : "1px 7px",
                      borderRadius : "50%",
                      color : "white",
                      background : "red",
                      fontSize : "13px"
                    }}>{chat.quantity}</span>
                  }
                </div>
                <div
                  style={{ width: "40%", flexDirection: "row", marginLeft: 10 }}
                >
                  <div style={{ marginTop: 10, fontSize: 18, marginLeft: 5 }}>
                    {chat.name}
                  </div>
                  <div
                    style={{
                      fontSize: 15,
                      marginTop: 7,
                      color: chat.quantity > 0 ? "black" : "gray",
                      marginLeft: 5,
                      fontWeight: chat.quantity > 0 && "bold",
                    }}
                  >
                    <span>{chat.sender == userId ? "Bạn: " : ""}</span>
                    <span>
                      {chat.message?.length > 15
                        ? chat.message.includes(regexUrl)
                          ? chat.message.split("--")[1].slice(0, 10)
                          : chat.message.slice(0, 10)
                        : chat.message}
                    </span>
                    <span>{chat.message?.length > 15 ? "..." : null}</span>
                  </div>
                </div>
                <div
                  style={{
                    width: "35%",
                    textAlign: "end",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                  }}
                >
                  <div style={{ padding: 5 }}>
                    <i
                      className="fa-solid fa-ellipsis icon"
                      onClick={() => handleClickUtils(chat.id)}
                    ></i>
                  </div>
                  <span>
                    {moment
                      .duration(
                        moment().diff(
                          moment(chat.dateTimeSend)
                            .utcOffset(0)
                            .format("YYYY-MM-DD HH:mm:ss")
                        )
                      )
                      .humanize(true)}
                  </span>
                  {idChat === chat.id && isClickUtils && (
                    <div
                      style={{
                        width: "150px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "space-around",
                        //padding: "5px 0 5px 10px",
                        backgroundColor: "white",
                        position: "absolute",
                        zIndex: 1,
                        borderRadius: "2%",
                        boxShadow: "0 0 5px #b4a7a7",
                        left: -14,
                        top: 25,
                      }}
                    >
                      <div className="utils">Ghim hội thoại</div>
                      <div
                        className="utils"
                        style={{ color: "red" }}
                        onClick={() => setVisibleDel(true)}
                      >
                        Xóa hội thoại
                      </div>
                      <FormDeleteChat
                        setVisible={setVisibleDel}
                        visible={visibleDel}
                        setIsClickUtils={setIsClickUtils}
                        userId={userId}
                        objectId={chat}
                        urlBackend={urlBackend}
                        setRerender={setRerender}
                        setDeleteChat={setDeleteChat}
                      />
                      <div className="utils">Thêm vào nhóm</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default ListChat;
