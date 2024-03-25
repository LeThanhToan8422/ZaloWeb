import "../../sass/ContentChat.scss";
import { useEffect, useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";

//import icon
import { SendOutlined, EditOutlined } from "@ant-design/icons";
import { LuSticker, LuAlarmClock } from "react-icons/lu";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { IoVideocamOutline, IoSearchOutline } from "react-icons/io5";
import {
  VscLayoutSidebarRightOff,
  VscLayoutSidebarRight,
} from "react-icons/vsc";
import { BsBell, BsPinAngle } from "react-icons/bs";
import { HiOutlineUsers } from "react-icons/hi2";
import axios from "axios";
// import { Stomp } from "@stomp/stompjs";
// import SockJS from "sockjs-client";
import { io } from "socket.io-client";

//emotion
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

//form
import InfoUser from "./components/InfoUser";
import FormUpdateName from "./components/formUpdateName";

const ContentChat = ({ userId, idChat, handleChangeMessageFinal }) => {
  let scrollRef = useRef(null);

  const [isClickInfo, setIsClickInfo] = useState(false);
  const [isClickSticker, setIsClickSticker] = useState(false);
  const [isClickUser, setIsClickUser] = useState(false);
  const [nameReceiver, setNameReceiver] = useState({});
  const [nameSender, setNameSender] = useState({});
  const [contentMessages, setContentMessages] = useState([]);

  const [message, setMessage] = useState("");
  const [displayIcons, setDisplayIcons] = useState(false);
  const [isClickUpdate, setIsClickUpdate] = useState(false);
  const [file, setFile] = useState("");

  const [socket, setSocket] = useState(null);
  useEffect(() => {
    let newSocket = io("http://localhost:8080");
    newSocket.emit(`Client-Chat-Room`, {
      message: "",
      chatRoom: userId > idChat ? `${idChat}${userId}` : `${userId}${idChat}`,
    });
    setSocket(newSocket);
  }, [JSON.stringify(contentMessages)]);

  useEffect(() => {
    socket?.on(
      `Server-Chat-Room-${
        userId > idChat ? `${idChat}${userId}` : `${userId}${idChat}`
      }`,
      (dataGot) => {
        handleChangeMessageFinal(dataGot.data);
        setContentMessages((oldMsgs) => [...oldMsgs, dataGot.data]);
      }
    ); // mỗi khi có tin nhắn thì mess sẽ được render thêm

    return () => {
      socket?.disconnect();
    };
  }, [JSON.stringify(contentMessages)]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [JSON.stringify(contentMessages)]);

  const sendMessage = () => {
    if (message !== null) {
      socket.emit(`Client-Chat-Room`, {
        message: message,
        sender: userId,
        receiver: idChat,
        chatRoom: userId > idChat ? `${idChat}${userId}` : `${userId}${idChat}`,
      });

      setMessage("");
      setDisplayIcons(false);
    }
  };

  useEffect(() => {
    let getApiContentChats = async () => {
      let datas = await axios.get(
        `http://localhost:8080/chats/content-chats-between-users/${userId}-and-${idChat}`
      );
      let sender = await axios.get(`http://localhost:8080/users/${userId}`);
      let receiver = await axios.get(`http://localhost:8080/users/${idChat}`);

      setContentMessages(
        datas.data.map((dt) => {
          const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
          if (urlRegex.test(dt.message)) {
            dt.url = dt.message;
            dt.message = "";
          }
          return dt;
        })
      );
      setNameReceiver({
        name: receiver.data.name,
        image: receiver.data.image,
      });
      setNameSender({
        name: sender.data.name,
        image: sender.data.image,
      });
    };
    getApiContentChats();
  }, [userId, idChat]);

  let handleChangeFile = (e) => {
    const file = e.target.files[0];

  const reader = new FileReader();

  reader.onload = (readerEvent) => {
    const buffer = readerEvent.target.result;

    const reactFile = {
      fieldname: 'image',
      originalname: file.name,
      encoding: '7bit',
      mimetype: file.type,
      buffer: buffer,
      size: file.size
    };
    console.log(reactFile);
    // TODO: Sử dụng đối tượng reactFile theo nhu cầu của bạn
    socket.emit(`Client-Chat-Room-File`, {
      file: reactFile,
      sender: userId,
      receiver: idChat,
      chatRoom: userId > idChat ? `${idChat}${userId}` : `${userId}${idChat}`,
    });

    setMessage("");
    setDisplayIcons(false);
  
  };

  reader.readAsArrayBuffer(file);
  };

  return (
    <div className="container-content-chat">
      {/* slide */}
      {idChat === "" ? (
        <div className="slides">
          <div className="slogan">
            <div className="slogan-title">
              Chào mừng đến với <b>Zalo PC</b>!
            </div>
            <p>
              Khám phá những tiện ích hỗ trợ làm việc và trò chuyện cùng <br />{" "}
              người thân, bạn bè được tối ưu hóa cho máy tính của bạn
            </p>
          </div>
          <Swiper
            spaceBetween={30}
            centeredSlides={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
            className="mySwiper"
          >
            <SwiperSlide>
              <img className="slide" alt="" src="/slide1.png" />
              <div className="slide-title">
                Nhắn tin nhiều hơn, soạn thảo ít hơn
              </div>
              <div className="slide-content">
                Sử dụng <b>Tin Nhắn Nhanh </b>để lưu sẵn các tin nhắn thường
                dùng và gửi nhanh trong hội thoại bất kỳ
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <img className="slide" alt="" src="/slide2.png" />
              <div className="slide-title">Tin nhắn tự xóa</div>
              <div className="slide-content">
                Từ giờ tin nhắn đã có thể tự động xóa sau khoảng thời gian nhất
                định.
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <img className="slide" alt="" src="/slide4.png" />
              <div className="slide-title">
                Gọi nhóm và làm việc hiệu quả với Zalo Group Call
              </div>
              <div className="slide-content">
                Trao đổi công việc mọi lúc mọi nơi
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <img className="slide" alt="" src="/slide5.png" />
              <div className="slide-title">Trải nghiệm xuyên suốt</div>
              <div className="slide-content">
                Kết nối và giải quyết công việc trên mọi thiết bị với dữ liệu
                luôn được đồng bộ
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <img className="slide" alt="" src="/slide6.png" />
              <div className="slide-title">Gửi file nặng?</div>
              <div className="slide-content">
                Đã có Zalo PC &quot;xử&quot; hết
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <img className="slide" alt="" src="/slide7.png" />
              <div className="slide-title">Chat nhóm với đồng nghiệp</div>
              <div className="slide-content">
                Tiện lợi hơn, nhờ các công cụ hỗ trợ chat trên máy tính
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <img className="slide" alt="" src="/slide8.png" />
              <div className="slide-title">
                Giải quyết công việc hiệu quả hơn, lên đến 40%
              </div>
              <div className="slide-content">Với Zalo PC</div>
            </SwiperSlide>
          </Swiper>
        </div>
      ) : (
        <>
          <InfoUser
            setVisible={setIsClickUser}
            visible={isClickUser}
            userId={idChat}
          />
          <FormUpdateName
            setVisible={setIsClickUpdate}
            visible={isClickUpdate}
            user={nameReceiver}
          />
          <div
            className="content-chat"
            style={{ width: isClickInfo ? "70%" : "" }}
          >
            <div className="chat-header">
              <div className="chat-header-left">
                <div
                  className="chat-header-left-avt"
                  onClick={() => setIsClickUser(true)}
                >
                  <img
                    src={
                      nameReceiver.image == null
                        ? "/public/avatardefault.png"
                        : nameReceiver.image
                    }
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                    }}
                  />
                </div>
                <div className="chat-header-left-name">
                  <div className="user">
                    <div className="user-name">{nameReceiver.name}</div>
                    <div className="user-edit">
                      <EditOutlined onClick={() => setIsClickUpdate(true)} />
                    </div>
                  </div>
                  <div className="is-active">Active</div>
                </div>
              </div>
              <div className="chat-header-right">
                <div className="chat-header-right-icon">
                  <AiOutlineUsergroupAdd className="icon" />
                </div>
                <div className="chat-header-right-icon">
                  <IoSearchOutline className="icon" />{" "}
                </div>
                <div className="chat-header-right-icon">
                  <IoVideocamOutline className="icon" />
                </div>
                <div
                  className="chat-header-right-icon"
                  onClick={() => setIsClickInfo(!isClickInfo)}
                  style={{
                    color: isClickInfo ? "#0068ff" : "",
                    background: isClickInfo ? "#d4e4fa" : "",
                  }}
                >
                  {isClickInfo ? (
                    <VscLayoutSidebarRight className="icon" />
                  ) : (
                    <VscLayoutSidebarRightOff className="icon" />
                  )}
                </div>
              </div>
            </div>
            <div className="chat-view">
              {contentMessages.map((message, index) => (
                <div
                  ref={index === contentMessages.length - 1 ? scrollRef : null}
                  key={index}
                  className="message"
                  style={{
                    justifyContent:
                      message.sender !== userId ? "flex-start" : "flex-end",
                    marginTop: index === 0 ? "10px" : "0px",
                  }}
                >
                  {message.sender !== userId ? (
                    <img
                      src={
                        nameReceiver.image == null
                          ? "/public/avatardefault.png"
                          : nameReceiver.image
                      }
                      className="avatar-user"
                      onClick={() => setIsClickUser(true)}
                      style={{ cursor: "pointer" }}
                    />
                  ) : null}

                  <div className="content-message">
                    {message.message ? (
                      <span className="info mess">{message.message}</span>
                    ) : (
                      <img
                        src={`${message.url}`}
                        style={{
                          width: "200px",
                          height: "200px",
                        }}
                      />
                    )}
                    <span
                      className="info time"
                      style={{ fontSize: 10, color: "darkgrey" }}
                    >
                      {message.dateTimeSend?.slice(11, 16)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="chat-utilities">
              <div
                className="chat-utilities-icon"
                onClick={() => setIsClickSticker(!isClickSticker)}
                style={{
                  color: isClickSticker ? "#0068ff" : "",
                  background: isClickSticker ? "#d4e4fa" : "",
                }}
              >
                <LuSticker className="icon" />
              </div>
              <div className="chat-utilities-icon">
                <input
                  type="file"
                  style={{ display: "none" }}
                  id="image"
                  onChange={(e) => handleChangeFile(e)}
                />
                <label htmlFor="image">
                  <i className="fa-regular fa-image icon"></i>
                </label>
              </div>
              <div className="chat-utilities-icon">
                <input type="file" style={{ display: "none" }} id="file" />
                <label htmlFor="file">
                  <i className="fa-solid fa-paperclip icon"></i>
                </label>
              </div>
              <div className="chat-utilities-icon">
                <i className="fa-regular fa-address-card icon"></i>
              </div>
              <div className="chat-utilities-icon">
                <i className="fa-regular fa-clock icon"></i>
              </div>
              <div className="chat-utilities-icon">
                <i className="fa-regular fa-square-check icon"></i>
              </div>
            </div>
            <div className="chat-text">
              <div className="chat-text-left">
                {/*Input Send message*/}
                <input
                  className="chat-text-input"
                  type="text"
                  placeholder={`Nhập @, tin nhắn tới ${nameReceiver.name}`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <div className="chat-text-right">
                <div
                  className="chat-text-icon"
                  onClick={() => setDisplayIcons(!displayIcons)}
                >
                  <i
                    className="fa-regular fa-face-grin"
                    style={{
                      fontSize: "20px",
                      color: displayIcons ? "#0068ff" : "",
                    }}
                  ></i>
                  <div
                    className="content-icons"
                    style={{ display: displayIcons ? "flex" : "none" }}
                  >
                    <Picker
                      data={data}
                      onEmojiSelect={(e) => setMessage(message + e.native)}
                    />
                  </div>
                </div>

                {/*Send message*/}
                <div className="chat-text-icon" onClick={sendMessage}>
                  <SendOutlined className="icon" />
                </div>
              </div>
            </div>
          </div>
          {/* info chat */}
          <div
            className="chat-info"
            style={{
              width: isClickInfo ? "30%" : "",
              display: isClickInfo ? "flex" : "none",
              height: isClickInfo ? "100%" : "",
            }}
          >
            <div className="header">Thông tin hội thoại</div>
            <div className="header-info">
              <div className="header-info-avt">
                <i className="fa-solid fa-user-tie icon"></i>
              </div>
              <div className="header-info-name">
                <div className="user-name">Le Thi Kim Ngan</div>
                <div className="user-edit">
                  <EditOutlined />
                </div>
              </div>
              <div className="header-info-utilities">
                <div className="notif">
                  <BsBell className="icon" />
                  <span>
                    Tắt thông <br /> báo
                  </span>
                </div>
                <div className="pin-chat">
                  <BsPinAngle className="icon" />
                  <span>
                    Ghim hội <br /> thoại
                  </span>
                </div>
                <div className="group-chat">
                  <AiOutlineUsergroupAdd className="icon" />
                  <span>
                    Tạo nhóm <br /> trò chuyện
                  </span>
                </div>
              </div>
            </div>
            <div className="chat-info-general">
              <div className="list-remider">
                <LuAlarmClock className="icon" />
                <span>Danh sách nhắc hẹn</span>
              </div>
              <div className="group-general">
                <HiOutlineUsers className="icon" />
                <span>0 nhóm chung</span>
              </div>
            </div>
            <div className="group-media"></div>
            <div className="group-file"></div>
            <div className="group-link"></div>
            <div className="group-setting"></div>
          </div>
        </>
      )}

      {/* content chat */}
    </div>
  );
};

export default ContentChat;
