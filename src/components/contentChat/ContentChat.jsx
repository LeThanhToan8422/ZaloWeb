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
import { LuSticker, LuAlarmClock, LuTrash } from "react-icons/lu";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import {
  IoVideocamOutline,
  IoSearchOutline,
  IoSettingsOutline,
  IoChevronBack,
} from "react-icons/io5";
import {
  VscLayoutSidebarRightOff,
  VscLayoutSidebarRight,
} from "react-icons/vsc";
import { BsBell, BsPinAngle, BsEyeSlash } from "react-icons/bs";
import { HiOutlineUsers } from "react-icons/hi2";
import { CiTrash } from "react-icons/ci";
import { MdOutlineSettingsBackupRestore, MdGroups } from "react-icons/md";
import { FaShare, FaCaretDown, FaCaretRight } from "react-icons/fa";
import { BiSolidToggleLeft } from "react-icons/bi";
import { MdKeyboardVoice } from "react-icons/md";
import { GiNotebook } from "react-icons/gi";
import { GrReturn } from "react-icons/gr";

import axios from "axios";

import { io } from "socket.io-client";

import { ReactMic } from "react-mic";

//emotion
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

//form
import InfoUser from "./components/InfoUser";
import FormUpdateName from "./components/formUpdateName";
import ViewFile from "./components/ViewFile";
import ForwardMessageForm from "./components/ForwardMessageForm";
import FormCard from "./components/FormCard";
import moment from "moment";
import ViewNewFriend from "./components/ViewNewFriend";
import FormAddMemberToGroup from "./components/FormAddMemberToGroup";
import toast from "react-hot-toast";

const ContentChat = ({
  userId,
  idChat,
  handleChangeMessageFinal,
  setRerender,
  urlBackend,
}) => {
  let scrollRef = useRef(null);

  const [isClickInfo, setIsClickInfo] = useState(false);
  const [isClickSticker, setIsClickSticker] = useState(false);
  const [isClickUser, setIsClickUser] = useState(false);
  const [nameReceiver, setNameReceiver] = useState({});
  const [nameSender, setNameSender] = useState({});
  const [contentMessages, setContentMessages] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoverText, setHoverText] = useState("");

  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [displayIcons, setDisplayIcons] = useState(false);
  const [isClickUpdate, setIsClickUpdate] = useState(false);
  const [regexUrl] = useState(
    "https://s3-dynamodb-cloudfront-20040331.s3.ap-southeast-1.amazonaws.com/"
  );
  const [regexUrlBlob] = useState(
    /^blob:http:\/\/localhost:\d+\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
  );
  const [isRerenderStatusChat, setIsRerenderStatusChat] = useState(false);
  const [socket, setSocket] = useState(null);
  const [forwardedMessageContent, setForwardedMessageContent] = useState("");
  const [showForwardForm, setShowForwardForm] = useState(false);
  const [showFormCard, setShowFormCard] = useState(false);
  const inputRef = useRef(null);

  const [isClickDownMedia, setIsClickDownMedia] = useState(false);
  const [isClickDownFile, setIsClickDownFile] = useState(false);
  const [isClickDownLink, setIsClickDownLink] = useState(false);
  const [isClickDownSetting, setIsClickDownSetting] = useState(false);
  const [isRecoding, setIsRecoding] = useState(false);
  const [voice, setVoice] = useState(false);
  const [audioLink, setAudioLink] = useState("");
  const [voiceMessage, setVoiceMessage] = useState(null);
  const [page, setPage] = useState(1);
  const [group, setGroup] = useState(null);
  const [isGroup, setIsGroup] = useState(false);
  const [isClickDownMember, setIsClickDownMember] = useState(false);
  const [isClickDownNew, setIsClickDownNew] = useState(false);
  const [isClickAddMember, setIsClickAddMember] = useState(false);
  const [fileType, setFileType] = useState([
    "xls",
    "xlsx",
    "doc",
    "docx",
    "csv",
    "txt",
    "ppt",
    "pptx",
    "rar",
    "zip",
    "fa-file",
  ]);
  const [imageType, setImageType] = useState([
    "png",
    "jpeg",
    "jpg",
    "gif",
    "bmp",
    "tiff",
  ]);
  const [videoType, setVideoType] = useState(["mp3", "mp4"]);
  const [isClickViewMember, setIsClickViewMember] = useState(false);
  const [showUtilsForLeader, setShowUtilsForLeader] = useState(false);
  const [membersOfGroup, setMembersOfGroup] = useState(null);
  const regexLink = /(https?:\/\/[^\s]+)/g;

  useEffect(() => {
    setPage(1);
    setNameSender({});
    setNameReceiver({});
  }, [JSON.stringify(idChat)]);

  useEffect(() => {
    let newSocket = io(`${urlBackend}`);
    setSocket(newSocket);
  }, [
    JSON.stringify(contentMessages),
    JSON.stringify(idChat),
    isRerenderStatusChat,
  ]);

  useEffect(() => {
    const fetchGroupChat = async () => {
      try {
        const response = await axios.get(
          `${urlBackend}/group-chats/${idChat.id}`
        );
        setGroup(response.data);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };
    fetchGroupChat();
  }, [userId, JSON.stringify(idChat), JSON.stringify(group)]);

  useEffect(() => {
    if (idChat.type === "Single") {
      setIsGroup(false);
      socket?.on(
        `Server-Chat-Room-${
          userId > idChat.id ? `${idChat.id}${userId}` : `${userId}${idChat.id}`
        }`,
        (dataGot) => {
          handleChangeMessageFinal(dataGot.data);
          setContentMessages((oldMsgs) => [...oldMsgs, dataGot.data]);
          setRerender((pre) => !pre);
        }
      );

      socket?.on(
        `Server-Status-Chat-${
          userId > idChat.id ? `${idChat.id}${userId}` : `${userId}${idChat.id}`
        }`,
        (dataGot) => {
          handleChangeMessageFinal(dataGot.data.chatFinal);
          setIsRerenderStatusChat(!isRerenderStatusChat);
        }
      );
    } else {
      setIsGroup(true);
      socket?.on(`Server-Chat-Room-${idChat.id}`, (dataGot) => {
        handleChangeMessageFinal(dataGot.data);
        setContentMessages((oldMsgs) => [...oldMsgs, dataGot.data]);
        setRerender((pre) => !pre);
      });

      socket?.on(`Server-Status-Chat-${idChat.id}`, (dataGot) => {
        setRerender((pre) => !pre);
        setIsRerenderStatusChat(!isRerenderStatusChat);
      });

      socket?.on(`Server-Change-Deputy-Group-Chats-${group.id}`, (dataGot) => {
        setGroup(dataGot.data);
      });

      socket?.on(`Server-Change-Leader-Group-Chats-${group.id}`, (dataGot) => {
        setGroup(dataGot.data);
      });
    }

    return () => {
      socket?.disconnect();
    };
  }, [
    JSON.stringify(contentMessages),
    JSON.stringify(idChat),
    isRerenderStatusChat,
    JSON.stringify(group),
  ]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [JSON.stringify(contentMessages)]);

  useEffect(() => {
    let getApiMembersOfGroup = async () => {
      let datas = await axios.get(
        `${urlBackend}/users/get-members-in-group/${idChat.id}`
      );
      setMembersOfGroup(datas.data);
    };
    getApiMembersOfGroup();
  }, [isClickViewMember, JSON.stringify(group)]);

  const sendMessage = () => {
    if (idChat.type === "Single") {
      if (message !== null) {
        socket.emit(`Client-Chat-Room`, {
          message: message,
          dateTimeSend: moment().format("YYYY-MM-DD HH:mm:ss"),
          sender: userId,
          receiver: idChat.id,
          chatRoom:
            userId > idChat.id
              ? `${idChat.id}${userId}`
              : `${userId}${idChat.id}`,
        });

        setMessage("");
        if (inputRef.current) {
          inputRef.current.focus();
        }
        setDisplayIcons(false);
      }
    } else {
      if (message !== null) {
        socket.emit(`Client-Chat-Room`, {
          message: message,
          dateTimeSend: moment().format("YYYY-MM-DD HH:mm:ss"),
          sender: userId,
          groupChat: idChat.id,
          chatRoom: idChat.id,
        });

        setMessage("");
        if (inputRef.current) {
          inputRef.current.focus();
        }
        setDisplayIcons(false);
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    let getApiContentChats = async () => {
      let datas = await axios.get(
        `${urlBackend}/chats/content-chats-between-users/${userId}-and-${
          idChat.id
        }/${page * 10}`
      );
      let sender = await axios.get(`${urlBackend}/users/${userId}`);
      let receiver = await axios.get(`${urlBackend}/users/${idChat.id}`);

      setContentMessages(datas.data);
      setNameReceiver({
        name: receiver.data.name,
        image: receiver.data.image,
      });
      setNameSender({
        name: sender.data.name,
        image: sender.data.image,
      });
    };

    let getApiContentGroupChats = async () => {
      let datas = await axios.get(
        `${urlBackend}/group-chats/content-chats-between-group/${
          idChat.id
        }/${userId}/${page * 10}`
      );
      let sender = await axios.get(`${urlBackend}/users/${datas.sender}`);

      setContentMessages(datas.data);
      setNameSender({
        name: sender.data.name,
        image: sender.data.image,
      });
    };

    if (idChat.type === "Single") {
      getApiContentChats();
    } else {
      getApiContentGroupChats();
    }
  }, [userId, JSON.stringify(idChat), isRerenderStatusChat, page]);

  let handleChangeFile = async (e) => {
    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];
      const reader = new FileReader();

      reader.onload = (readerEvent) => {
        const buffer = readerEvent.target.result;

        const reactFile = {
          originalname: file.name,
          encoding: "7bit",
          mimetype: file.type,
          buffer: buffer,
          size: file.size,
        };
        console.log(reactFile);
        // TODO: Sử dụng đối tượng reactFile theo nhu cầu của bạn
        socket.emit(`Client-Chat-Room`, {
          file: reactFile,
          dateTimeSend: moment().utcOffset(7).format("YYYY-MM-DD HH:mm:ss"),
          sender: userId,
          receiver: idChat.type === "Single" ? idChat.id : null,
          groupChat: idChat.type === "Group" ? idChat.id : null,
          chatRoom:
            idChat.type === "Single"
              ? userId > idChat.id
                ? `${idChat.id}${userId}`
                : `${userId}${idChat.id}`
              : idChat.id,
        });
      };

      reader.readAsArrayBuffer(file);
    }
    setMessage("");
    setDisplayIcons(false);
  };

  let handleClickStatusChat = (status, userId, chat, time) => {
    console.log(time);
    const sentTime = new Date(time);
    const currentTime = new Date();
    const timeDiff = currentTime - sentTime;
    const millisIn24Hours = 24 * 60 * 60 * 1000;
    const isSentMoreThan24HoursAgo = timeDiff >= millisIn24Hours;
    if(isSentMoreThan24HoursAgo){
      toast.error("Bạn chỉ có thể thu hồi tin nhắn trong vòng 24h!")
    }else {
    socket.emit(`Client-Status-Chat`, {
      status: status,
      implementer: userId,
      chat: chat,
      chatRoom:
        idChat.type === "Single"
          ? userId > idChat.id
            ? `${idChat.id}${userId}`
            : `${userId}${idChat.id}`
          : idChat.id,
    });
    setIsRerenderStatusChat(!isRerenderStatusChat);
  }
  };

  let handleClickSendVoiceMessage = (blob) => {
    const formData = new FormData();
    let blobWithProp = new Blob([blob["blob"]], blob["options"]);
    formData.append("audioFile", blobWithProp, "test.wav");
    console.log(formData);
    // fetch(audioLink).then(res => res.blob()).then(blob => {
    //   const downloadLink = document.createElement('a');
    //   downloadLink.href = window.URL.createObjectURL(blob);
    //   downloadLink.download = "test.wav";
    //   document.body.appendChild(downloadLink);
    //   downloadLink.click();
    //   document.body.removeChild(downloadLink);
    // })
    // .catch(err => {
    //   console.error('Lỗi khi tải: ', err);
    // })
    // if (idChat.type === "Single") {
    //   if (audioLink) {
    //     socket.emit(`Client-Chat-Room`, {
    //       message: audioLink,
    //       dateTimeSend: moment().format("YYYY-MM-DD HH:mm:ss"),
    //       sender: userId,
    //       receiver: idChat.id,
    //       chatRoom:
    //         userId > idChat.id
    //           ? `${idChat.id}${userId}`
    //           : `${userId}${idChat.id}`,
    //     });

    //     setMessage("");
    //     if (inputRef.current) {
    //       inputRef.current.focus();
    //     }
    //     setDisplayIcons(false);
    //   }
    // } else {
    //   if (audioLink) {
    //     socket.emit(`Client-Chat-Room`, {
    //       message: audioLink,
    //       dateTimeSend: moment().format("YYYY-MM-DD HH:mm:ss"),
    //       sender: userId,
    //       groupChat: idChat.id,
    //       chatRoom: idChat.id,
    //     });

    //     setMessage("");
    //     if (inputRef.current) {
    //       inputRef.current.focus();
    //     }
    //     setDisplayIcons(false);
    //   }
    // }
  };

  const handleForwardButtonClick = (message) => {
    setForwardedMessageContent(message);
    setShowForwardForm(true);
  };

  const handleForwardFormCancel = () => {
    setShowForwardForm(false);
  };

  const onStopRecoding = (blob) => {
    setVoiceMessage(blob);
    setAudioLink(blob.blobURL);
    const reactFile = {
      mimetype: blob.options.mimeType,
      buffer: blob.blob.arrayBuffer,
      size: blob.blob.size,
    };
    //handleClickSendVoiceMessage(blob);

    const formData = new FormData();
    let blobWithProp = new Blob([blob["blob"]], blob["options"]);
    formData.append("audioFile", blobWithProp);
    console.log(formData);
  };
  const handleStart = () => {
    setVoice(true);
  };
  const handleStop = () => {
    setVoice(false);
  };
  useEffect(() => {
    if (idChat && inputRef.current) {
      inputRef.current.focus();
    }
  }, [JSON.stringify(idChat)]);

  let handleScrollContentChats = (e) => {
    if (e.currentTarget.scrollTop === 0) {
      setPage((pre) => pre + 1);
    }
  };

  const handleClickRecording = () => {
    setAudioLink("");
    setIsRecoding(!isRecoding);
  };

  let handleClickDeleteMember = async (id) => {
    socket.emit(`Client-Update-Group-Chats`, {
      group: group,
      mbs: id,
    });
    group.members = JSON.stringify(group.members.filter((m) => m !== id));
    setGroup(group);
  };

  let handleClickDissolutionGroup = async () => {
    socket.emit(`Client-Dessolution-Group-Chats`, {
      group: group,
    });
  };

  let handleClickChangeDeputy = (value) => {
    group.deputy = value;
    socket.emit(`Client-Change-Deputy-Group-Chats`, {
      group: group,
    });
    setGroup(group);
  };

  let handleClickChangeLeader = (value) => {
    if (group.deputy === value) {
      toast.error("Bạn phải đổi phó nhóm trước khi chuyển trưởng nhóm.");
    } else {
      group.leader = value;
      socket.emit(`Client-Change-Leader-Group-Chats`, {
        group: group,
      });
      setGroup(group);
    }
  };

  return (
    <div className="container-content-chat">
      {/* slide */}
      {!idChat.id ? (
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
            userId={userId}
            friendId={idChat}
            urlBackend={urlBackend}
          />
          <FormUpdateName
            setVisible={setIsClickUpdate}
            visible={isClickUpdate}
            user={nameReceiver}
            urlBackend={urlBackend}
          />
          <FormAddMemberToGroup
            setVisible={setIsClickAddMember}
            visible={isClickAddMember}
            userId={userId}
            groupId={idChat}
            group={group}
            setGroup={setGroup}
            urlBackend={urlBackend}
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
                        ? contentMessages[0]?.imageGroup
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
                    <div className="user-name">
                      {nameReceiver.name
                        ? nameReceiver.name
                        : contentMessages[0]?.nameGroup}
                    </div>
                    <div className="user-edit">
                      <EditOutlined onClick={() => setIsClickUpdate(true)} />
                    </div>
                  </div>
                  <div className="is-active">Active</div>
                </div>
              </div>
              <div className="chat-header-right">
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
            <div
              className="chat-view"
              onScroll={(e) => handleScrollContentChats(e)}
            >
              {contentMessages.map((message, index) => {
                return message.isRecalls ? (
                  <div
                    ref={
                      index === contentMessages.length - 1 ? scrollRef : null
                    }
                    key={index}
                    className="message"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
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
                            ? message.imageUser
                            : nameReceiver.image
                        }
                        className="avatar-user"
                        onClick={() => setIsClickUser(true)}
                        style={{ cursor: "pointer" }}
                      />
                    ) : null}
                    <div className="content-message">
                      <span className="info mess" style={{ color: "#7B8089" }}>
                        Tin nhắn đã được thu hồi
                      </span>
                      <span
                        className="info time"
                        style={{ fontSize: 10, color: "darkgrey" }}
                      >
                        {message.dateTimeSend?.slice(11, 16)}
                      </span>
                    </div>
                    {index === hoveredIndex && message.sender !== userId && !message.isRecalls ? (
                      <div style={{ width: "100px", height: "20px" }}>
                        <div
                          className="utils-message"
                          style={{
                            marginLeft: "7px",
                            marginTop: "5px",
                            width: "48px",
                          }}
                        >
                          <CiTrash
                            style={{
                              color:
                                hoverText == "Xóa chỉ ở phía tôi"
                                  ? "#005ae0"
                                  : "",
                            }}
                            onMouseEnter={() =>
                              setHoverText("Xóa chỉ ở phía tôi")
                            }
                            onMouseLeave={() => setHoverText("")}
                            onClick={() =>
                              handleClickStatusChat(
                                "delete",
                                userId,
                                message.id
                              )
                            }
                          />
                          <FaShare
                            style={{
                              fontSize: "20px",
                              color:
                                hoverText === "Chuyển tiếp" ? "#005ae0" : "",
                            }}
                            onMouseEnter={() => setHoverText("Chuyển tiếp")}
                            onMouseLeave={() => setHoverText("")}
                            onClick={() =>
                              handleForwardButtonClick(message.message)
                            }
                          />
                          {showForwardForm && (
                            <ForwardMessageForm
                              userId={userId}
                              visible={showForwardForm}
                              onCancel={handleForwardFormCancel}
                              sharedContentFromInfoMess={
                                forwardedMessageContent
                              }
                              setRerender={setRerender}
                              urlBackend={urlBackend}
                            />
                          )}
                        </div>
                        <span
                          style={{
                            fontSize: "12px",
                            backgroundColor: "#261e1e",
                            color: "#c3c1c1",
                          }}
                        >
                          {hoverText}
                        </span>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                ) : message.message.match(
                    /Bạn và(?:\s"[^"]+"|\s[^"]+|\s\w+)\sđã trở thành bạn/g
                  ) ? (
                  <ViewNewFriend
                    key={message.id}
                    name={nameReceiver.name}
                    imgFriend={nameReceiver.image}
                    img={nameSender.image}
                    dateTimeSend={message.dateTimeSend}
                  />
                ) : message.message.match(regexUrlBlob) ? (
                  <audio
                    src={
                      "blob:http://localhost:5173/aa9b1297-1e33-4a49-af71-7c9c233cec26"
                    }
                    controls
                  ></audio>
                ) : (
                  <div
                    ref={
                      index === contentMessages.length - 1 ? scrollRef : null
                    }
                    key={index}
                    className="message"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
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
                            ? message.imageUser
                            : nameReceiver.image
                        }
                        className="avatar-user"
                        onClick={() => setIsClickUser(true)}
                        style={{ cursor: "pointer" }}
                      />
                    ) : null}
                    {index === hoveredIndex && message.sender === userId ? (
                      <div style={{ width: "100px", height: "20px" }}>
                        <div
                          className="utils-message"
                          style={{
                            marginLeft: "12px",
                            marginTop: "5px",
                            width: "80px",
                          }}
                        >
                          <MdOutlineSettingsBackupRestore
                            style={{
                              color: hoverText == "Thu hồi" ? "#005ae0" : "",
                            }}
                            onMouseEnter={() => setHoverText("Thu hồi")}
                            onMouseLeave={() => setHoverText("")}
                            onClick={() =>
                              handleClickStatusChat(
                                "recalls",
                                userId,
                                message.id, message.dateTimeSend
                              )
                            }
                          />
                          <CiTrash
                            style={{
                              color:
                                hoverText == "Xóa chỉ ở phía tôi"
                                  ? "#005ae0"
                                  : "",
                            }}
                            onMouseEnter={() =>
                              setHoverText("Xóa chỉ ở phía tôi")
                            }
                            onMouseLeave={() => setHoverText("")}
                            onClick={() =>
                              handleClickStatusChat(
                                "delete",
                                userId,
                                message.id
                              )
                            }
                          />
                          <FaShare
                            style={{
                              color:
                                hoverText === "Chuyển tiếp" ? "#005ae0" : "",
                            }}
                            onMouseEnter={() => setHoverText("Chuyển tiếp")}
                            onMouseLeave={() => setHoverText("")}
                            onClick={() =>
                              handleForwardButtonClick(message.message)
                            }
                          />
                          {showForwardForm && (
                            <ForwardMessageForm
                              userId={userId}
                              visible={showForwardForm}
                              onCancel={handleForwardFormCancel}
                              sharedContentFromInfoMess={
                                forwardedMessageContent
                              }
                              setRerender={setRerender}
                              urlBackend={urlBackend}
                            />
                          )}
                        </div>

                        <span
                          style={{
                            fontSize: "12px",
                            backgroundColor: "#261e1e",
                            color: "#c3c1c1",
                          }}
                        >
                          {hoverText}
                        </span>
                      </div>
                    ) : (
                      ""
                    )}
                    <div>
                      {!nameReceiver.name && message.sender !== userId && (
                        <span>{message.name}</span>
                      )}
                      <div className="content-message">
                        {message.message.includes(regexUrl) ? (
                          <ViewFile url={message.message} />
                        ) : (
                          <span className="info mess">
                            {message.message.match(regexLink)? 
                            (<a href={message.message} target="_blank" rel="noopener noreferrer" style={{color: 'blue', textDecoration: "underline"}}>{message.message}</a>)
                            :message.message}
                          </span>
                        )}
                        <span
                          className="info time"
                          style={{ fontSize: 10, color: "darkgrey" }}
                        >
                          {message.dateTimeSend?.slice(11, 16)}
                        </span>
                      </div>
                    </div>
                    {index === hoveredIndex && message.sender !== userId ? (
                      <div style={{ width: "100px", height: "20px" }}>
                        <div
                          className="utils-message"
                          style={{
                            marginLeft: "7px",
                            marginTop: "5px",
                            width: "60px",
                          }}
                        >
                          <CiTrash
                            style={{
                              color:
                                hoverText == "Xóa chỉ ở phía tôi"
                                  ? "#005ae0"
                                  : "",
                            }}
                            onMouseEnter={() =>
                              setHoverText("Xóa chỉ ở phía tôi")
                            }
                            onMouseLeave={() => setHoverText("")}
                            onClick={() =>
                              handleClickStatusChat(
                                "delete",
                                userId,
                                message.id
                              )
                            }
                          />
                          <FaShare
                            style={{
                              color:
                                hoverText === "Chuyển tiếp" ? "#005ae0" : "",
                            }}
                            onMouseEnter={() => setHoverText("Chuyển tiếp")}
                            onMouseLeave={() => setHoverText("")}
                            onClick={() =>
                              handleForwardButtonClick(message.message)
                            }
                          />
                          {showForwardForm && (
                            <ForwardMessageForm
                              userId={userId}
                              visible={showForwardForm}
                              onCancel={handleForwardFormCancel}
                              sharedContentFromInfoMess={
                                forwardedMessageContent
                              }
                              setRerender={setRerender}
                              urlBackend={urlBackend}
                            />
                          )}
                        </div>
                        <span
                          style={{
                            fontSize: "12px",
                            backgroundColor: "#261e1e",
                            color: "#c3c1c1",
                          }}
                        >
                          {hoverText}
                        </span>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                );
              })}
            </div>

            <div className="chat-utilities">
              {/* button sticker */}
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
              {/* button image */}
              <div className="chat-utilities-icon">
                <input
                  type="file"
                  accept=".png, .jpg, .jpeg, .gif, .bmp, .tiff"
                  multiple
                  style={{ display: "none" }}
                  id="image"
                  onChange={(e) => handleChangeFile(e)}
                />
                <label htmlFor="image">
                  <i className="fa-regular fa-image icon"></i>
                </label>
              </div>
              {/* button file */}
              <div className="chat-utilities-icon">
                <input
                  type="file"
                  accept=".xls, .xlsx, .doc, .docx, .csv, .txt, .ppt, .pptx, .mp3, .mp4, .rar, .zip, .fa-file"
                  multiple
                  style={{ display: "none" }}
                  id="file"
                  onChange={(e) => handleChangeFile(e)}
                />
                <label htmlFor="file">
                  <i className="fa-solid fa-paperclip icon"></i>
                </label>
              </div>
              {/* button name card */}
              <div
                className="chat-utilities-icon"
                onClick={() => setShowFormCard(true)}
              >
                <FormCard
                  userId={userId}
                  setVisible={setShowFormCard}
                  visible={showFormCard}
                  urlBackend={urlBackend}
                />

                <i className="fa-regular fa-address-card icon"></i>
              </div>
              {/* button chat Recoding */}
              <div className="chat-utilities-icon">
                <MdKeyboardVoice
                  className="icon"
                  onClick={handleClickRecording}
                />
                {isRecoding && (
                  <div
                    style={{
                      position: "absolute",
                      display: "flex",
                      width: "200px",
                      margin: "0 0 200px 120px",
                      flexDirection: "column",
                      backgroundColor: "white",
                      padding: "10px",
                    }}
                  >
                    <ReactMic
                      record={voice}
                      className="sound-wave"
                      onStop={onStopRecoding}
                      //onData={onData}
                      strokeColor="#000000"
                      backgroundColor="#FF4081"
                    />
                    {!voice ? (
                      <button onClick={handleStart}>Start</button>
                    ) : (
                      <button onClick={handleStop}>Stop</button>
                    )}
                    {audioLink ? (
                      <audio
                        src={audioLink}
                        controls
                        style={{ width: "180px", height: "40px" }}
                      ></audio>
                    ) : (
                      ""
                    )}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <button
                        style={{
                          border: "1px solid black",
                          padding: "5px 15px",
                          borderRadius: "10px",
                          margin: "10px",
                        }}
                        // onClick={handleClickSendVoiceMessage}
                      >
                        Send
                      </button>
                    </div>
                  </div>
                )}
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
                  ref={inputRef}
                  className="chat-text-input"
                  type="text"
                  placeholder={`Nhập @, tin nhắn tới ${
                    nameReceiver.name
                      ? nameReceiver.name
                      : contentMessages[0]?.nameGroup
                  }`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                {image ? <img src={image} /> : ""}
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
            {isClickViewMember ? (
              <>
                <div
                  className="header"
                  style={{ justifyContent: "flex-start" }}
                >
                  <IoChevronBack
                    onClick={() => setIsClickViewMember(false)}
                    style={{ cursor: "pointer" }}
                  />
                  <span style={{ marginLeft: "70px" }}>Thành viên</span>
                </div>
                <div className="view-member">
                  <div
                    className="add-member"
                    onClick={() => setIsClickAddMember(true)}
                  >
                    <AiOutlineUsergroupAdd className="icon" />
                    <span>Thêm thành viên</span>
                  </div>
                  <div className="list-member">
                    <span className="list-member-text">
                      Danh sách thành viên
                    </span>
                    {membersOfGroup?.map((u, index) => (
                      <div
                        className="member"
                        key={index}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setShowUtilsForLeader(false)}
                      >
                        <div
                          className="member-avt"
                          style={{ position: "relative" }}
                        >
                          <img src={u.image} />
                          {(group.leader === u.id || group.deputy === u.id) && (
                            <i
                              className="fa-solid fa-key"
                              style={{
                                position: "absolute",
                                bottom: -5,
                                right: 0,
                                fontSize: "8px",
                                color:
                                  group.leader === u.id ? "yellow" : "silver",
                                borderRadius: "50%",
                                padding: "5px",
                                backgroundColor: "#666666",
                              }}
                            ></i>
                          )}
                        </div>
                        <div className="member-name">{u.name}</div>
                        {(group.leader === userId ||
                          group.deputy === userId) && (
                          <i
                            className="fa-solid fa-ellipsis icon"
                            onClick={() =>
                              setShowUtilsForLeader(!showUtilsForLeader)
                            }
                          ></i>
                        )}
                        {showUtilsForLeader &&
                          index === hoveredIndex &&
                          u.id !== group.leader && (
                            <div
                              className="utils-leader"
                              style={{
                                width: "180px",
                                textAlign: "center",
                              }}
                            >
                              {(userId === group.leader &&
                              group.deputy === null) ? (
                                <span
                                  onClick={() => handleClickChangeDeputy(u.id)}
                                >
                                  Thêm phó nhóm
                                </span>
                              ) : userId === group.leader &&
                                group.deputy === u.id ? (
                                <span
                                  onClick={() => handleClickChangeDeputy(null)}
                                >
                                  Xóa phó nhóm
                                </span>
                              ) : null}
                              {userId === group.leader && group.deputy !== null && group.deputy !== u.id && (
                                <span
                                  onClick={() => handleClickChangeDeputy(u.id)}
                                >
                                  Đổi phó nhóm
                                </span>
                              )}
                              {(userId === group.leader ||
                                userId === group.deputy) && (
                                <span
                                  onClick={() => handleClickDeleteMember(u.id)}
                                >
                                  {userId === u.id ? "Rời khỏi nhóm" : "Xóa khỏi nhóm"}
                                </span>
                              )}
                              {userId === group.leader && (
                                <span
                                  onClick={() => handleClickChangeLeader(u.id)}
                                >
                                  Chuyển trưởng nhóm
                                </span>
                              )}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="header">Thông tin hội thoại</div>
                <div className="header-info">
                  <div className="header-info-avt">
                    <img
                      src={
                        nameReceiver.image == null
                          ? contentMessages[0]?.imageGroup
                          : nameReceiver.image
                      }
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                      }}
                    />
                  </div>
                  <div className="header-info-name">
                    <div className="user-name">
                      {nameReceiver.name
                        ? nameReceiver.name
                        : contentMessages[0]?.nameGroup}
                    </div>
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
                    {!isGroup ? (
                      <div className="group-chat">
                        <AiOutlineUsergroupAdd className="icon" />
                        <span>
                          Tạo nhóm <br /> trò chuyện
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="group-chat">
                          <AiOutlineUsergroupAdd
                            className="icon"
                            onClick={() => setIsClickAddMember(true)}
                          />
                          <span>
                            Thêm <br /> thành viên
                          </span>
                        </div>
                        <div className="group-chat">
                          <IoSettingsOutline className="icon" />
                          <span>
                            Quản lý <br /> nhóm
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {!isGroup ? (
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
                ) : (
                  <>
                    <div className="group-member">
                      <div className="member-header">
                        <span>Thành viên nhóm</span>
                        <div
                          onClick={() =>
                            setIsClickDownMember(!isClickDownMember)
                          }
                        >
                          {isClickDownMember ? (
                            <FaCaretRight className="icon" />
                          ) : (
                            <FaCaretDown className="icon" />
                          )}
                        </div>
                      </div>
                      <div style={{ display: isClickDownMember ? "none" : "" }}>
                        <div
                          className="member-body"
                          onClick={() => setIsClickViewMember(true)}
                        >
                          <MdGroups className="icon" />
                          <span style={{ marginRight: "5px" }}>
                            {group.members?.length}
                          </span>
                          <span>thành viên</span>
                        </div>
                      </div>
                    </div>
                    <div className="group-new">
                      <div className="new-header">
                        <span>Bảng tin nhóm</span>
                        <div onClick={() => setIsClickDownNew(!isClickDownNew)}>
                          {isClickDownNew ? (
                            <FaCaretRight className="icon" />
                          ) : (
                            <FaCaretDown className="icon" />
                          )}
                        </div>
                      </div>
                      <div style={{ display: isClickDownNew ? "none" : "" }}>
                        <div className="new-body">
                          <LuAlarmClock className="icon" />
                          <span>Danh sách nhắc hẹn</span>
                        </div>
                        <div className="new-body">
                          <GiNotebook className="icon" />
                          <span>Ghi chú, ghim, bình chọn</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="group-media">
                  <div className="media-header">
                    <span>Ảnh/Video</span>
                    <div onClick={() => setIsClickDownMedia(!isClickDownMedia)}>
                      {isClickDownMedia ? (
                        <FaCaretRight className="icon" />
                      ) : (
                        <FaCaretDown className="icon" />
                      )}
                    </div>
                  </div>
                  <div style={{ display: isClickDownMedia ? "none" : "" }}>
                    <div className="media-body">
                      {contentMessages.map((message, index) => (
                        <div className="frame" key={index}>
                          {message.message.includes(regexUrl) &&
                          imageType.includes(
                            message.message.substring(
                              message.message.lastIndexOf(".") + 1
                            )
                          ) ? (
                            <img
                              src={message.message}
                              style={{
                                width: "50px",
                                height: "50px",
                                border: "1px solid #7589a3",
                                borderRadius: "4px",
                              }}
                            />
                          ) : (
                            ""
                          )}
                          {message.message.includes(regexUrl) &&
                          videoType.includes(
                            message.message.substring(
                              message.message.lastIndexOf(".") + 1
                            )
                          ) ? (
                            <video
                              src={message.message}
                              controls
                              style={{
                                width: "50px",
                                height: "50px",
                                border: "1px solid #7589a3",
                                borderRadius: "4px",
                              }}
                            />
                          ) : (
                            ""
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="btn">
                      <div className="btn-all">Xem tất cả</div>
                    </div>
                  </div>
                </div>
                <div className="group-file">
                  <div className="file-header">
                    <span>File</span>
                    <div onClick={() => setIsClickDownFile(!isClickDownFile)}>
                      {isClickDownFile ? (
                        <FaCaretRight className="icon" />
                      ) : (
                        <FaCaretDown className="icon" />
                      )}
                    </div>
                  </div>
                  <div style={{ display: isClickDownFile ? "none" : "" }}>
                    {contentMessages.map((message, index) => (
                      <div className="file-body" key={index}>
                        {message.message.includes(regexUrl) &&
                        fileType.includes(
                          message.message.substring(
                            message.message.lastIndexOf(".") + 1
                          )
                        ) ? (
                          <div className="frame">
                            <ViewFile url={message.message} />
                            <span
                              className="info time"
                              style={{ fontSize: 10, color: "darkgrey" }}
                            >
                              {message.dateTimeSend?.split("T")[0]}
                            </span>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    ))}

                    <div className="btn">
                      <div className="btn-all">Xem tất cả</div>
                    </div>
                  </div>
                </div>
                <div className="group-link">
                  <div className="file-header">
                    <span>Link</span>
                    <div onClick={() => setIsClickDownLink(!isClickDownLink)}>
                      {isClickDownLink ? (
                        <FaCaretRight className="icon" />
                      ) : (
                        <FaCaretDown className="icon" />
                      )}
                    </div>
                  </div>
                  <div style={{ display: isClickDownLink ? "none" : "" }}>
                    <div className="link-body">
                      <div className="frame"></div>
                    </div>
                    <div className="btn">
                      <div className="btn-all">Xem tất cả</div>
                    </div>
                  </div>
                </div>
                <div
                  className="group-setting"
                  style={{ "border-bottom": "none" }}
                >
                  <div className="setting-header">
                    <span>Thiết lập bảo mật</span>
                    <div
                      onClick={() => setIsClickDownSetting(!isClickDownSetting)}
                    >
                      {isClickDownSetting ? (
                        <FaCaretRight className="icon" />
                      ) : (
                        <FaCaretDown className="icon" />
                      )}
                    </div>
                  </div>
                  <div
                    className="setting-body"
                    style={{ display: isClickDownSetting ? "none" : "" }}
                  >
                    <div className="hidden-chat">
                      <BsEyeSlash className="icon" />
                      <span>Ẩn trò chuyện</span>
                      <BiSolidToggleLeft className="icon-toggle" />
                    </div>
                    <div className="delete-chat">
                      <LuTrash className="icon" />
                      <span>Xóa lịch sử trò chuyện</span>
                    </div>
                    {isGroup && (
                      <>
                        <div
                          className="delete-chat"
                          onClick={() => handleClickDeleteMember(userId)}
                        >
                          <GrReturn className="icon" />
                          <span>Rời nhóm</span>
                        </div>
                        {userId === group?.leader && (
                          <div
                            className="delete-chat"
                            onClick={handleClickDissolutionGroup}
                          >
                            <GrReturn className="icon" />
                            <span>Giải tán nhóm</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* content chat */}
    </div>
  );
};

export default ContentChat;
