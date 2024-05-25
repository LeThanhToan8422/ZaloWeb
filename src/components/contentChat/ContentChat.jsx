import "../../sass/ContentChat.scss";
import { useEffect, useRef, useState } from "react";

//import icon
import { IoIosClose } from "react-icons/io";
import { SendOutlined, EditOutlined } from "@ant-design/icons";
import { LuSticker, LuAlarmClock, LuTrash } from "react-icons/lu";
import { AiOutlineUsergroupAdd, AiTwotoneLike } from "react-icons/ai";
import {
  IoVideocamOutline,
  IoSearchOutline,
  IoSettingsOutline,
  IoChevronBack,
  IoCameraOutline,
  IoCallOutline,
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
import { BiSolidToggleLeft, BiSolidQuoteRight } from "react-icons/bi";
import { MdKeyboardVoice } from "react-icons/md";
import { GiNotebook } from "react-icons/gi";
import { GrReturn } from "react-icons/gr";

import axios from "axios";

import { io } from "socket.io-client";

import { ReactMic } from "react-mic";

import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

import InfoUser from "./components/InfoUser";
import FormUpdateName from "./components/formUpdateName";
import ViewFile from "./components/ViewFile";
import ForwardMessageForm from "./components/ForwardMessageForm";
import moment from "moment";
import ViewNewFriend from "./components/ViewNewFriend";
import FormAddMemberToGroup from "./components/FormAddMemberToGroup";
import FormChangeNameGroup from "./components/FormChangeNameGroup";
import ViewListEmoji from "./components/ViewListEmoji";

import toast from "react-hot-toast";
import SlideZalo from "../home/SlideZalo";

import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import FormConfirm from "./components/FormConfirm";

const ContentChat = ({
  displayListChat,
  userId,
  idChat,
  handleChangeMessageFinal,
  setRerender,
  urlBackend,
  rerender,
  rerenderGroupChat,
  zp,
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
  const [fileType] = useState([
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
  const [imageType] = useState(["png", "jpeg", "jpg", "gif", "bmp", "tiff"]);
  const [videoType] = useState(["mp3", "mp4"]);
  const [isClickViewMember, setIsClickViewMember] = useState(false);
  const [showUtilsForLeader, setShowUtilsForLeader] = useState(false);
  const [membersOfGroup, setMembersOfGroup] = useState(null);
  const regexLink = /(https?:\/\/[^\s]+)/g;
  const [isClickUpdateNameGroup, setIsClickUpdateNameGroup] = useState(false);
  const [isReloadPage, setIsReloadPage] = useState(false);
  const [isClickReply, setIsClickReply] = useState(false);
  const [messageRelpy, setMessageRelpy] = useState(null);
  const [emojis] = useState([
    {
      type: "like",
      icon: "👍",
    },
    {
      type: "love",
      icon: "❤️",
    },
    {
      type: "haha",
      icon: "😂",
    },
    {
      type: "wow",
      icon: "😲",
    },
    {
      type: "sad",
      icon: "😭",
    },
    {
      type: "angry",
      icon: "😡",
    },
  ]);
  const [isHoverEmoji, setIsHoverEmoji] = useState(false);
  const [hoveredIndexE, setHoveredIndexE] = useState(null);
  const [selectedEmoji, setSelectedEmoji] = useState([]);
  const [isViewListEmoji, setIsViewListEmoji] = useState(false);
  const [quantityEmoji, setQuantityEmoji] = useState();
  const [nameReply, setNameReply] = useState("");
  const [chatSelectedDisplayEmojis, setChatSelectedDisplayEmojis] = useState(0);
  const [rerenderSocket, setRerenderSocket] = useState(false);
  const [isClickDisGroup, setIsClickDisGroup] = useState(false);

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
    isReloadPage,
    rerenderGroupChat,
    rerenderSocket,
  ]);

  useEffect(() => {
    if (idChat.id) {
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
    }
  }, [
    userId,
    JSON.stringify(idChat),
    JSON.stringify(group),
    isReloadPage,
    rerenderGroupChat,
  ]);

  let isObjectEqual = (obj1, obj2) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  };

  useEffect(() => {
    if (idChat.type === "Single") {
      setIsGroup(false);
      socket?.on(
        `Server-Chat-Room-${
          userId > idChat.id ? `${idChat.id}${userId}` : `${userId}${idChat.id}`
        }`,
        (dataGot) => {
          const exists = contentMessages.some((item) =>
            isObjectEqual(item, dataGot.data)
          );
          if (!exists) {
            handleChangeMessageFinal(dataGot.data);
            setRerender((pre) => !pre);
            setIsReloadPage((pre) => !pre);
          }
        }
      );

      socket?.on(
        `Server-Status-Chat-${
          userId > idChat.id ? `${idChat.id}${userId}` : `${userId}${idChat.id}`
        }`,
        (dataGot) => {
          handleChangeMessageFinal(dataGot.data.chatFinal);
          setIsReloadPage((pre) => !pre);
          setIsClickReply(false);
        }
      );

      socket?.on(
        `Server-Emotion-Chats-${
          userId > idChat.id ? `${idChat.id}${userId}` : `${userId}${idChat.id}`
        }`,
        (dataGot) => {
          setIsReloadPage((pre) => !pre);
        }
      );
    } else {
      setIsGroup(true);
      socket?.on(`Server-Chat-Room-${idChat.id}`, (dataGot) => {
        const exists = contentMessages.some((item) =>
          isObjectEqual(item, dataGot.data)
        );
        if (!exists) {
          handleChangeMessageFinal(dataGot.data);
          setRerender((pre) => !pre);
          setIsReloadPage((pre) => !pre);
        }
      });

      socket?.on(`Server-Status-Chat-${idChat.id}`, (dataGot) => {
        setRerender((pre) => !pre);
        setIsReloadPage((pre) => !pre);
      });

      socket?.on(`Server-Emotion-Chats-${group?.id}`, (dataGot) => {
        console.log("OKKKK");
        setIsReloadPage((pre) => !pre);
      });
    }

    return () => {
      socket?.disconnect();
    };
  }, [
    JSON.stringify(contentMessages),
    JSON.stringify(idChat),
    JSON.stringify(group),
    isReloadPage,
    rerender,
    rerenderSocket,
  ]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [JSON.stringify(contentMessages), isReloadPage]);

  useEffect(() => {
    if (idChat.id) {
      let getApiMembersOfGroup = async () => {
        let datas = await axios.get(
          `${urlBackend}/users/get-members-in-group/${idChat.id}`
        );
        setMembersOfGroup([...datas.data]);
      };
      getApiMembersOfGroup();
    }
  }, [isClickViewMember, JSON.stringify(group)]);

  useEffect(() => {
    let getApiContentChats = async () => {
      let datas = await axios.get(
        `${urlBackend}/chats/content-chats-between-users/${userId}-and-${
          idChat.id
        }/${page * 10}`
      );
      let sender = await axios.get(`${urlBackend}/users/${userId}`);
      let receiver = await axios.get(`${urlBackend}/users/${idChat.id}`);

      setContentMessages([
        ...datas.data.map((dt) => {
          if (dt.emojis) {
            dt.emojis = [...new Set(dt.emojis.split(","))];
          }
          return dt;
        }),
      ]);
      setNameReceiver({
        id: receiver.data.id,
        name: receiver.data.name,
        image: receiver.data.image,
      });
      setNameSender({
        id: sender.data.id,
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
      setContentMessages([
        ...datas.data.map((dt) => {
          if (dt.emojis) {
            dt.emojis = [...new Set(dt.emojis.split(","))];
          }
          return dt;
        }),
      ]);
      setNameSender({
        name: sender.data.name,
        image: sender.data.image,
      });
    };

    if (idChat.id) {
      if (idChat.type === "Single") {
        getApiContentChats();
      } else {
        getApiContentGroupChats();
      }
    }
  }, [userId, JSON.stringify(idChat), page, isReloadPage, rerender]);

  useEffect(() => {
    if (idChat && inputRef.current) {
      inputRef.current.focus();
    }
  }, [JSON.stringify(idChat)]);

  const sendMessage = () => {
    if (idChat.type === "Single") {
      if (message !== null) {
        socket.emit(`Client-Chat-Room`, {
          message: message,
          dateTimeSend: moment().format("YYYY-MM-DD HH:mm:ss"),
          sender: userId,
          receiver: idChat.id,
          chatReply: messageRelpy?.id,
          chatRoom:
            userId > idChat.id
              ? `${idChat.id}${userId}`
              : `${userId}${idChat.id}`,
          type: idChat.type,
        });
      }
    } else {
      if (message !== null) {
        socket.emit(`Client-Chat-Room`, {
          message: message,
          dateTimeSend: moment().format("YYYY-MM-DD HH:mm:ss"),
          sender: userId,
          groupChat: idChat.id,
          chatReply: messageRelpy?.id ? messageRelpy?.id : null,
          chatRoom: idChat.id,
          type: idChat.type,
        });
      }
    }
    setMessage("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setDisplayIcons(false);
    setIsClickReply(false);
    setMessageRelpy(null);
    setIsReloadPage((pre) => !pre);
    setRerender((pre) => !pre);
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  let handleChangeFile = async (e) => {
    for (let i = 0; i < e.currentTarget.files.length; i++) {
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
    setIsReloadPage((pre) => !pre);
  };

  let handleClickStatusChat = (status, userId, chat, time) => {
    const sentTime = new Date(time);
    const currentTime = new Date();
    const timeDiff = currentTime - sentTime;
    const millisIn24Hours = 24 * 60 * 60 * 1000;
    const isSentMoreThan24HoursAgo = timeDiff >= millisIn24Hours;
    if (isSentMoreThan24HoursAgo) {
      toast.error("Bạn chỉ có thể thu hồi tin nhắn trong vòng 24h!");
    } else {
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
      setIsReloadPage((pre) => !pre);
    }
  };

  let handleClickSendVoiceMessage = () => {
    if (voiceMessage) {
      const reader = new FileReader();

      reader.onload = (readerEvent) => {
        const buffer = readerEvent.target.result;

        const reactFile = {
          originalname: "VoiceMessage",
          encoding: "7bit",
          mimetype: voiceMessage.options.mimeType,
          buffer: buffer,
          size: voiceMessage.blob.size,
        };
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

      reader.readAsArrayBuffer(voiceMessage.blob);
      setIsRecoding(false);
      setIsReloadPage((pre) => !pre);
    }
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
  };

  const handleStart = () => {
    setVoice(true);
  };

  const handleStop = () => {
    setVoice(false);
  };

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
    if (group.leader === id) {
      toast.error("Bạn phải chuyển trưởng nhóm trước khi rời.");
    } else {
      socket.emit(`Client-Update-Group-Chats`, {
        group: group,
        mbs: id,
        implementer: userId,
      });
      group.members = group.members.filter((m) => m !== id);
      setGroup({ ...group });
    }
  };

  let handleClickDissolutionGroup = () => {
    setIsClickDisGroup(true);
  };

  let handleClickChangeLeaderAndDeputy = (leader, deputy) => {
    socket.emit(`Client-Change-Leader-And-Deputy-Group-Chats`, {
      group: {
        ...group,
        leader: leader,
        deputy: leader === deputy ? null : deputy,
      },
      oldLeader: group.leader,
    });
  };

  let handleClickReplyChat = (message) => {
    if (message.sender === nameReceiver.id) {
      setNameReply(nameReceiver.name);
    } else {
      setNameReply(nameSender.name);
    }
    setIsClickReply(true);
    setMessageRelpy({
      id: message.id,
      message: message.message,
    });
  };

  let handleClickEmoji = async (chat, emoji) => {
    socket.emit(`Client-Emotion-Chats`, {
      type: emoji.type,
      implementer: userId,
      chat: chat,
      chatRoom:
        idChat.type === "Single"
          ? userId > idChat.id
            ? `${idChat.id}${userId}`
            : `${userId}${idChat.id}`
          : idChat.id,
      members:
        idChat.type === "Single"
          ? [nameSender.id, nameReceiver.id]
          : group.members,
    });
    setIsHoverEmoji(false);
    setRerenderSocket((pre) => pre);
  };

  let handleClickViewListEmoji = (chatId, emojis, quantities) => {
    setChatSelectedDisplayEmojis(chatId);
    setQuantityEmoji(quantities);
    setSelectedEmoji(emojis);
    setIsViewListEmoji(true);
  };

  let handleClickVideoCall = () => {
    let targetUser;
    if (isGroup) {
      targetUser = membersOfGroup?.map((user) => ({
        userID: user.id + "",
        userName: user.name,
      }));
    } else {
      targetUser = [
        {
          userID: nameReceiver.id + "",
          userName: nameReceiver.name,
        },
      ];
    }
    zp?.sendCallInvitation({
      callees: targetUser,
      callType: ZegoUIKitPrebuilt.InvitationTypeVideoCall,
      timeout: 60, // Timeout duration (second). 60s by default, range from [1-600s].
    })
      .then((res) => {
        console.warn(res);
      })
      .catch((err) => {
        console.warn(err);
      });
  };

  let handleClickVoiceCall = () => {
    let targetUser;
    if (isGroup) {
      targetUser = membersOfGroup?.map((user) => ({
        userID: user.id + "",
        userName: user.name,
      }));
    } else {
      targetUser = [
        {
          userID: nameReceiver.id + "",
          userName: nameReceiver.name,
        },
      ];
    }
    zp?.sendCallInvitation({
      callees: targetUser,
      callType: ZegoUIKitPrebuilt.InvitationTypeVoiceCall,
      timeout: 60, // Timeout duration (second). 60s by default, range from [1-600s].
    })
      .then((res) => {
        console.warn(res);
      })
      .catch((err) => {
        console.warn(err);
      });
  };

  return (
    <div
      className="container-content-chat"
      style={{ width: displayListChat ? "71%" : "96%" }}
    >
      {/* slide */}
      {!idChat.id ? (
        <SlideZalo />
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
            user={nameReceiver ? nameReceiver : ""}
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
          <FormChangeNameGroup
            socket={socket}
            setVisible={setIsClickUpdateNameGroup}
            visible={isClickUpdateNameGroup}
            group={group}
            urlBackend={urlBackend}
            setIsReloadPage={setIsReloadPage}
          />
          <ViewListEmoji
            setVisible={setIsViewListEmoji}
            visible={isViewListEmoji}
            userId={userId}
            groupId={idChat}
            urlBackend={urlBackend}
            emojis={selectedEmoji}
            quantity={quantityEmoji}
            chatSelectedDisplayEmojis={chatSelectedDisplayEmojis}
          />
          {isClickDisGroup && (
            <FormConfirm
              setVisible={setIsClickDisGroup}
              visible={isClickDisGroup}
              group={group ? group : null}
              socket={socket}
              message={"Bạn có chắc chắn muốn giải tán nhóm?"}
            />
          )}
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
                      nameReceiver?.image == null
                        ? group?.image
                        : nameReceiver?.image
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
                      {nameReceiver?.name ? nameReceiver?.name : group?.name}
                    </div>
                    <div className="user-edit">
                      {nameReceiver?.name ? (
                        <EditOutlined onClick={() => setIsClickUpdate(true)} />
                      ) : (
                        <EditOutlined
                          onClick={() => setIsClickUpdateNameGroup(true)}
                        />
                      )}
                    </div>
                  </div>
                  <div className="is-active">Active</div>
                </div>
              </div>
              <div className="chat-header-right">
                <div className="chat-header-right-icon">
                  <IoSearchOutline className="icon" />{" "}
                </div>
                <div
                  className="chat-header-right-icon"
                  onClick={handleClickVoiceCall}
                >
                  <IoCallOutline className="icon" />
                </div>
                <div
                  className="chat-header-right-icon"
                  onClick={handleClickVideoCall}
                >
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
                    {index === hoveredIndex &&
                    message.sender !== userId &&
                    !message.isRecalls ? (
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
                ) : message.message.match(/(.+) đã thêm (.+) vào nhóm\./) ||
                  message.message.match(/(.+) đã xóa (.+) khỏi nhóm\./) ||
                  message.message.match(
                    /(.+) đã phân quyền (.+) thành (.+) nhóm\./
                  ) ? (
                  <span
                    style={{
                      color: "#7589A3",
                      fontSize: "12px",
                      margin: "3px 0px",
                    }}
                  >
                    {message.message}
                  </span>
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
                    {index === hoveredIndex &&
                    message.sender === userId &&
                    !isHoverEmoji ? (
                      <div style={{ width: "120px", height: "20px" }}>
                        <div
                          className="utils-message"
                          style={{
                            marginLeft: "12px",
                            marginTop: "5px",
                            width: "100px",
                          }}
                        >
                          <BiSolidQuoteRight
                            style={{
                              color: hoverText == "Trả lời" ? "#005ae0" : "",
                            }}
                            onMouseEnter={() => setHoverText("Trả lời")}
                            onMouseLeave={() => setHoverText("")}
                            onClick={() => handleClickReplyChat(message)}
                          />
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
                                message.id,
                                message.dateTimeSend
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
                      <div
                        className="content-message"
                        style={{ minWidth: message.emojis && "200px" }}
                      >
                        {message.chatReply ? (
                          <div
                            className="content-message-reply"
                            style={{ width: "100%" }}
                          >
                            <div>
                              <b>
                                {
                                  contentMessages.find(
                                    (ms) => ms.id === message.chatReply
                                  )?.name
                                }
                              </b>
                            </div>
                            <div>
                              {
                                contentMessages.find(
                                  (ms) => ms.id === message.chatReply
                                )?.message
                              }
                            </div>
                          </div>
                        ) : (
                          ""
                        )}

                        {message.message.includes(regexUrl) ? (
                          <ViewFile url={message.message} />
                        ) : (
                          <span className="info mess">
                            {message.message.match(regexLink) ? (
                              <a
                                href={message.message}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: "blue",
                                  textDecoration: "underline",
                                }}
                              >
                                {message.message}
                              </a>
                            ) : (
                              message.message
                            )}
                          </span>
                        )}
                        <span
                          className="info time"
                          style={{ fontSize: 10, color: "darkgrey" }}
                        >
                          {message.dateTimeSend?.slice(11, 16)}
                        </span>
                        {
                          <>
                            {message.emojis && (
                              <div
                                style={{
                                  position: "absolute",
                                  bottom: -10,
                                  right: 50,
                                  border: "1px solid #b4b4b4",
                                  borderRadius: "10px",
                                  padding: "2px 10px",
                                  backgroundColor: "white",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleClickViewListEmoji(
                                    message.id,
                                    message.emojis,
                                    message.quantities
                                  )
                                }
                              >
                                {message.emojis.map((e, index) => {
                                  if (index < 3) {
                                    return (
                                      <span
                                        style={{ margin: "1px" }}
                                        key={index}
                                      >
                                        {
                                          emojis.find((ej) => ej.type === e)
                                            .icon
                                        }
                                      </span>
                                    );
                                  }
                                })}
                                <span>{message.quantities}</span>
                              </div>
                            )}
                            <div
                              className="emoji-message"
                              onMouseEnter={() => setIsHoverEmoji(true)}
                              onMouseLeave={() => setIsHoverEmoji(false)}
                            >
                              <AiTwotoneLike />
                            </div>
                          </>
                        }
                        {index === hoveredIndex && isHoverEmoji ? (
                          <div
                            className="emojis"
                            style={{
                              width: "200px",
                              padding: "0px 10px",
                              marginRight:
                                message.sender === userId ? "20px" : "0px",
                            }}
                            onMouseEnter={() => setIsHoverEmoji(true)}
                            onMouseLeave={() => setIsHoverEmoji(false)}
                          >
                            {emojis.map((emoji, index) => (
                              <div
                                className="emoji"
                                key={index}
                                onMouseEnter={() => setHoveredIndexE(index)}
                                onMouseLeave={() => setHoveredIndexE(null)}
                                style={{
                                  cursor: "pointer",
                                  fontSize:
                                    index === hoveredIndexE ? "18px" : "15px",
                                }}
                                onClick={() =>
                                  handleClickEmoji(message.id, emoji)
                                }
                              >
                                {emoji.icon}
                              </div>
                            ))}
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    {index === hoveredIndex &&
                    message.sender !== userId &&
                    !isHoverEmoji ? (
                      <div style={{ width: "100px", height: "20px" }}>
                        <div
                          className="utils-message"
                          style={{
                            marginLeft: "7px",
                            marginTop: "5px",
                            width: "80px",
                          }}
                        >
                          <BiSolidQuoteRight
                            style={{
                              color: hoverText == "Trả lời" ? "#005ae0" : "",
                            }}
                            onMouseEnter={() => setHoverText("Trả lời")}
                            onMouseLeave={() => setHoverText("")}
                            onClick={() => handleClickReplyChat(message)}
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
              {/* <div
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
              </div> */}
              {/* button chat Recoding */}
              <div
                className="chat-utilities-icon"
                style={{
                  backgroundColor: isRecoding ? "#d4e4fa" : "",
                  color: isRecoding ? "#0068ff" : "",
                }}
              >
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
                      justifyContent: "space-around",
                      textAlign: "center",
                      height: "100px",
                      margin: "0 0 180px 10px",
                      flexDirection: "column",
                      backgroundColor: "white",
                      padding: "10px 10px 0 10px",
                      boxShadow: "0 0 5px #b4a7a7",
                    }}
                  >
                    {!audioLink && (
                      <ReactMic
                        record={voice}
                        className="sound-wave"
                        onStop={onStopRecoding}
                        //onData={onData}
                        strokeColor="#000000"
                        backgroundColor="#94caf9"
                      />
                    )}
                    {!audioLink ? (
                      <div>
                        {!voice ? (
                          <button onClick={handleStart}>Bắt đầu</button>
                        ) : (
                          <button onClick={handleStop}>Dừng</button>
                        )}
                      </div>
                    ) : (
                      <>
                        <audio src={audioLink} controls></audio>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <button
                            style={{
                              padding: "3px 10px",
                              borderRadius: "10px",
                              margin: "10px",
                            }}
                            onClick={() => setAudioLink(false)}
                          >
                            Xóa
                          </button>
                          <button
                            style={{
                              backgroundColor: "#94caf9",
                              padding: "3px 10px",
                              borderRadius: "10px",
                              margin: "10px",
                            }}
                            onClick={handleClickSendVoiceMessage}
                          >
                            Gửi
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
              {/* <div className="chat-utilities-icon">
                <i className="fa-regular fa-clock icon"></i>
              </div>
              <div className="chat-utilities-icon">
                <i className="fa-regular fa-square-check icon"></i>
              </div> */}
            </div>
            <div
              className="chat"
              style={{ height: isClickReply ? "15%" : "12%" }}
            >
              <div
                className="chat-reply"
                style={{ display: isClickReply ? "flex" : "none" }}
              >
                <div className="chat-reply-message">
                  <div className="reply-title">
                    <BiSolidQuoteRight />{" "}
                    <span style={{ marginLeft: "5px" }}>
                      Trả lời <b>{nameReply}</b>
                    </span>
                  </div>
                  <div className="reply-message">{messageRelpy?.message}</div>
                </div>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => setIsClickReply(false)}
                >
                  <IoIosClose style={{ fontSize: "20px" }} />
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
                      nameReceiver?.name ? nameReceiver?.name : group?.name
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
                            <span
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
                                fontWeight: "bold",
                              }}
                            >
                              {group.leader === u.id ? "TN" : "PN"}
                            </span>
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
                              {userId === group.leader &&
                              group.deputy === null ? (
                                <span
                                  onClick={() =>
                                    handleClickChangeLeaderAndDeputy(
                                      group.leader,
                                      u.id
                                    )
                                  }
                                >
                                  Thêm phó nhóm
                                </span>
                              ) : userId === group.leader &&
                                group.deputy === u.id ? (
                                <span
                                  onClick={() =>
                                    handleClickChangeLeaderAndDeputy(
                                      group.leader,
                                      null
                                    )
                                  }
                                >
                                  Xóa phó nhóm
                                </span>
                              ) : null}
                              {userId === group.leader &&
                                group.deputy !== null &&
                                group.deputy !== u.id && (
                                  <span
                                    onClick={() =>
                                      handleClickChangeLeaderAndDeputy(
                                        group.leader,
                                        u.id
                                      )
                                    }
                                  >
                                    Đổi phó nhóm
                                  </span>
                                )}
                              {(userId === group.leader ||
                                userId === group.deputy) && (
                                <span
                                  onClick={() => handleClickDeleteMember(u.id)}
                                >
                                  {userId === u.id
                                    ? "Rời khỏi nhóm"
                                    : "Xóa khỏi nhóm"}
                                </span>
                              )}
                              {userId === group.leader && (
                                <span
                                  onClick={() =>
                                    handleClickChangeLeaderAndDeputy(
                                      u.id,
                                      group.deputy
                                    )
                                  }
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
                        nameReceiver?.image == null
                          ? group?.image
                          : nameReceiver?.image
                      }
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                      }}
                    />
                    <label
                      htmlFor="image"
                      style={{ marginLeft: "-15px", marginTop: "45px" }}
                    >
                      <IoCameraOutline style={{ cursor: "pointer" }} />
                    </label>
                    <input
                      type="file"
                      accept=".png, .jpg, .jpeg, .gif, .bmp, .tiff"
                      multiple
                      style={{ display: "none" }}
                      id="image"
                      onChange={(e) => handleChangeFile(e)}
                    />
                  </div>
                  <div className="header-info-name">
                    <div className="user-name">
                      {nameReceiver?.name ? nameReceiver?.name : group?.name}
                    </div>
                    <div className="user-edit">
                      {nameReceiver?.name ? (
                        <EditOutlined onClick={() => setIsClickUpdate(true)} />
                      ) : (
                        <EditOutlined
                          onClick={() => setIsClickUpdateNameGroup(true)}
                        />
                      )}
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
                            {group?.members?.length}
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
                            <a
                              href={message.message}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src={message.message}
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  border: "1px solid #7589a3",
                                  borderRadius: "4px",
                                }}
                              />
                            </a>
                          ) : (
                            null
                          )}
                          {message.message.includes(regexUrl) &&
                          videoType.includes(
                            message.message.substring(
                              message.message.lastIndexOf(".") + 1
                            )
                          ) ? (
                            <a
                              href={message.message}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
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
                            </a>
                          ) : (
                            null
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
                <div className="group-setting" style={{ borderBottom: "none" }}>
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
                    {/* <div className="hidden-chat">
                      <BsEyeSlash className="icon" />
                      <span>Ẩn trò chuyện</span>
                      <BiSolidToggleLeft className="icon-toggle" />
                    </div>
                    <div className="delete-chat">
                      <LuTrash className="icon" />
                      <span>Xóa lịch sử trò chuyện</span>
                    </div> */}
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
