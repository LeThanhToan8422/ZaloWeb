import '../../sass/ContentChat.scss';
import { useEffect, useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

//import icon
import { SendOutlined, EditOutlined } from '@ant-design/icons';
import { LuSticker, LuAlarmClock, LuTrash } from 'react-icons/lu';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { IoVideocamOutline, IoSearchOutline } from 'react-icons/io5';
import {
  VscLayoutSidebarRightOff,
  VscLayoutSidebarRight,
} from 'react-icons/vsc';
import { BsBell, BsPinAngle, BsEyeSlash } from 'react-icons/bs';
import { HiOutlineUsers } from 'react-icons/hi2';
import { CiTrash } from 'react-icons/ci';
import { MdOutlineSettingsBackupRestore } from 'react-icons/md';
import { FaShare, FaCaretDown, FaCaretRight } from 'react-icons/fa';
import { BiSolidToggleLeft } from 'react-icons/bi';

import axios from 'axios';

import { io } from 'socket.io-client';

//emotion
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

//form
import InfoUser from './components/InfoUser';
import FormUpdateName from './components/formUpdateName';
import ViewFile from './components/ViewFile';
import ForwardMessageForm from './components/ForwardMessageForm';
import FormCard from './components/FormCard';
import moment from 'moment';

const ContentChat = ({
  userId,
  idChat,
  handleChangeMessageFinal,
  chatSelected,
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
  const [hoverText, setHoverText] = useState('');

  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [displayIcons, setDisplayIcons] = useState(false);
  const [isClickUpdate, setIsClickUpdate] = useState(false);
  const [regexUrl] = useState(
    'https://s3-dynamodb-cloudfront-20040331.s3.ap-southeast-1.amazonaws.com/'
  );
  const [isRerenderStatusChat, setIsRerenderStatusChat] = useState(false);
  const [socket, setSocket] = useState(null);
  const [forwardedMessageContent, setForwardedMessageContent] = useState('');
  const [showForwardForm, setShowForwardForm] = useState(false);
  const [showFormCard, setShowFormCard] = useState(false);
  const inputRef = useRef(null);

  const [isClickDownMedia, setIsClickDownMedia] = useState(false);
  const [isClickDownFile, setIsClickDownFile] = useState(false);
  const [isClickDownLink, setIsClickDownLink] = useState(false);
  const [isClickDownSetting, setIsClickDownSetting] = useState(false);

  useEffect(() => {
    let newSocket = io(`${urlBackend}`);
    setSocket(newSocket);
  }, [JSON.stringify(contentMessages), chatSelected, isRerenderStatusChat]);

  useEffect(() => {
    socket?.on(
      `Server-Chat-Room-${
        userId > idChat ? `${idChat}${userId}` : `${userId}${idChat}`
      }`,
      (dataGot) => {
        console.log(dataGot.data);
        handleChangeMessageFinal(dataGot.data);
        setContentMessages((oldMsgs) => [...oldMsgs, dataGot.data]);
      }
    );

    return () => {
      socket?.disconnect();
    };
  }, [JSON.stringify(contentMessages), chatSelected, isRerenderStatusChat]);

  useEffect(() => {
    socket?.on(
      `Server-Status-Chat-${
        userId > idChat ? `${idChat}${userId}` : `${userId}${idChat}`
      }`,
      (dataGot) => {
        handleChangeMessageFinal(dataGot.data.chatFinal);
        setIsRerenderStatusChat(!isRerenderStatusChat);
      }
    );

    return () => {
      socket?.disconnect();
    };
  }, [JSON.stringify(contentMessages), isRerenderStatusChat]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [JSON.stringify(contentMessages)]);

  const sendMessage = () => {
    if (message !== null) {
      socket.emit(`Client-Chat-Room`, {
        message: message,
        dateTimeSend : moment().format('YYYY-MM-DD HH:mm:ss'),
        sender: userId,
        receiver: idChat,
        chatRoom: userId > idChat ? `${idChat}${userId}` : `${userId}${idChat}`,
      });

      setMessage('');
      if (inputRef.current) {
        inputRef.current.focus();
      }
      setDisplayIcons(false);
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
        `${urlBackend}/chats/content-chats-between-users/${userId}-and-${idChat}`
      );
      let sender = await axios.get(`${urlBackend}/users/${userId}`);
      let receiver = await axios.get(`${urlBackend}/users/${idChat}`);

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
    getApiContentChats();
  }, [userId, idChat, isRerenderStatusChat]);

  let handleChangeFile = async (e) => {
    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];
      const reader = new FileReader();

      reader.onload = (readerEvent) => {
        const buffer = readerEvent.target.result;

        const reactFile = {
          originalname: file.name,
          encoding: '7bit',
          mimetype: file.type,
          buffer: buffer,
          size: file.size,
        };
        // TODO: Sử dụng đối tượng reactFile theo nhu cầu của bạn
        socket.emit(`Client-Chat-Room`, {
          file: reactFile,
          dateTimeSend : moment()
          .utcOffset(7)
          .format("YYYY-MM-DD HH:mm:ss"),
          sender: userId,
          receiver: idChat,
          chatRoom:
            userId > idChat ? `${idChat}${userId}` : `${userId}${idChat}`,
        });
      };

      reader.readAsArrayBuffer(file);
    }
    setMessage('');
    setDisplayIcons(false);
  };

  let handleClickStatusChat = (status, userId, chat) => {
    socket.emit(`Client-Status-Chat`, {
      status: status,
      implementer: userId,
      chat: chat,
      chatRoom: userId > idChat ? `${idChat}${userId}` : `${userId}${idChat}`,
      objectId: idChat,
    });
    setIsRerenderStatusChat(!isRerenderStatusChat);
  };

  const handleForwardButtonClick = (message) => {
    setForwardedMessageContent(message);
    setShowForwardForm(true);
  };

  const handleForwardFormCancel = () => {
    setShowForwardForm(false);
  };

  useEffect(() => {
    if (chatSelected && inputRef.current) {
      inputRef.current.focus();
    }
  }, [chatSelected]);

  return (
    <div className="container-content-chat">
      {/* slide */}
      {idChat === '' ? (
        <div className="slides">
          <div className="slogan">
            <div className="slogan-title">
              Chào mừng đến với <b>Zalo PC</b>!
            </div>
            <p>
              Khám phá những tiện ích hỗ trợ làm việc và trò chuyện cùng <br />{' '}
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
            className="mySwiper">
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
            urlBackend={urlBackend}
          />
          <FormUpdateName
            setVisible={setIsClickUpdate}
            visible={isClickUpdate}
            user={nameReceiver}
            urlBackend={urlBackend}
          />
          <div
            className="content-chat"
            style={{ width: isClickInfo ? '70%' : '' }}>
            <div className="chat-header">
              <div className="chat-header-left">
                <div
                  className="chat-header-left-avt"
                  onClick={() => setIsClickUser(true)}>
                  <img
                    src={
                      nameReceiver.image == null
                        ? '/public/avatardefault.png'
                        : nameReceiver.image
                    }
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
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
                  <IoSearchOutline className="icon" />{' '}
                </div>
                <div className="chat-header-right-icon">
                  <IoVideocamOutline className="icon" />
                </div>
                <div
                  className="chat-header-right-icon"
                  onClick={() => setIsClickInfo(!isClickInfo)}
                  style={{
                    color: isClickInfo ? '#0068ff' : '',
                    background: isClickInfo ? '#d4e4fa' : '',
                  }}>
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
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    justifyContent:
                      message.sender !== userId ? 'flex-start' : 'flex-end',
                    marginTop: index === 0 ? '10px' : '0px',
                  }}>
                  {message.sender !== userId ? (
                    <img
                      src={
                        nameReceiver.image == null
                          ? '/public/avatardefault.png'
                          : nameReceiver.image
                      }
                      className="avatar-user"
                      onClick={() => setIsClickUser(true)}
                      style={{ cursor: 'pointer' }}
                    />
                  ) : null}
                  {index === hoveredIndex && message.sender === userId ? (
                    <div style={{ width: '100px' }}>
                      <div
                        className="utils-message"
                        style={{ marginRight: '7px', marginTop: '5px' }}>
                        <MdOutlineSettingsBackupRestore
                          style={{
                            color: hoverText == 'Thu hồi' ? '#005ae0' : '',
                          }}
                          onMouseEnter={() => setHoverText('Thu hồi')}
                          onMouseLeave={() => setHoverText('')}
                          onClick={() =>
                            handleClickStatusChat('recalls', userId, message.id)
                          }
                        />
                        <CiTrash
                          style={{
                            color:
                              hoverText == 'Xóa chỉ ở phía tôi'
                                ? '#005ae0'
                                : '',
                          }}
                          onMouseEnter={() =>
                            setHoverText('Xóa chỉ ở phía tôi')
                          }
                          onMouseLeave={() => setHoverText('')}
                          onClick={() =>
                            handleClickStatusChat('delete', userId, message.id)
                          }
                        />
                        <FaShare
                          style={{
                            color: hoverText === 'Chuyển tiếp' ? '#005ae0' : '',
                          }}
                          onMouseEnter={() => setHoverText('Chuyển tiếp')}
                          onMouseLeave={() => setHoverText('')}
                          onClick={() =>
                            handleForwardButtonClick(message.message)
                          }
                        />
                        {showForwardForm && (
                          <ForwardMessageForm
                            userId={userId}
                            visible={showForwardForm}
                            onCancel={handleForwardFormCancel}
                            sharedContentFromInfoMess={forwardedMessageContent}
                            setRerender={setRerender}
                            urlBackend={urlBackend}
                          />
                        )}
                      </div>

                      <span
                        style={{
                          fontSize: '12px',
                          backgroundColor: '#261e1e',
                          color: '#c3c1c1',
                        }}>
                        {hoverText}
                      </span>
                    </div>
                  ) : (
                    ''
                  )}
                  <div className="content-message">
                    {message.message.includes(regexUrl) ? (
                      <ViewFile url={message.message} />
                    ) : (
                      <span className="info mess">{message.message}</span>
                    )}
                    <span
                      className="info time"
                      style={{ fontSize: 10, color: 'darkgrey' }}>
                      {message.dateTimeSend?.slice(11, 16)}
                    </span>
                  </div>
                  {index === hoveredIndex && message.sender !== userId ? (
                    <div style={{ width: '100px', height: '20px' }}>
                      <div
                        className="utils-message"
                        style={{
                          marginLeft: '7px',
                          marginTop: '5px',
                          width: '48px',
                        }}>
                        <CiTrash
                          style={{
                            color:
                              hoverText == 'Xóa chỉ ở phía tôi'
                                ? '#005ae0'
                                : '',
                          }}
                          onMouseEnter={() =>
                            setHoverText('Xóa chỉ ở phía tôi')
                          }
                          onMouseLeave={() => setHoverText('')}
                          onClick={() =>
                            handleClickStatusChat('delete', userId, message.id)
                          }
                        />
                        <FaShare
                          style={{
                            fontSize: '20px',
                            color: hoverText === 'Chuyển tiếp' ? '#005ae0' : '',
                          }}
                          onMouseEnter={() => setHoverText('Chuyển tiếp')}
                          onMouseLeave={() => setHoverText('')}
                          onClick={() =>
                            handleForwardButtonClick(message.message)
                          }
                        />
                         {showForwardForm && (
                          <ForwardMessageForm
                            userId={userId}
                            visible={showForwardForm}
                            onCancel={handleForwardFormCancel}
                            sharedContentFromInfoMess={forwardedMessageContent}
                            setRerender={setRerender}
                            urlBackend={urlBackend}
                          />
                        )}
                      </div>
                      <span
                        style={{
                          fontSize: '12px',
                          backgroundColor: '#261e1e',
                          color: '#c3c1c1',
                        }}>
                        {hoverText}
                      </span>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              ))}
            </div>

            <div className="chat-utilities">
              {/* button sticker */}
              <div
                className="chat-utilities-icon"
                onClick={() => setIsClickSticker(!isClickSticker)}
                style={{
                  color: isClickSticker ? '#0068ff' : '',
                  background: isClickSticker ? '#d4e4fa' : '',
                }}>
                <LuSticker className="icon" />
              </div>
              {/* button image */}
              <div className="chat-utilities-icon">
                <input
                  type="file"
                  accept=".png, .jpg, .jpeg, .gif, .bmp, .tiff"
                  multiple
                  style={{ display: 'none' }}
                  id="image"
                  onChange={(e) => handleChangeFile(e)}
                />
                <label htmlFor="image">
                  <i className="fa-regular fa-image icon"></i>
                </label>
              </div>
              <div className="chat-utilities-icon">
                <input
                  type="file"
                  accept=".xls, .xlsx, .doc, .docx, .csv, .txt, .ppt, .pptx, .mp3, .mp4, .rar, .zip, .fa-file"
                  multiple
                  style={{ display: 'none' }}
                  id="file"
                  onChange={(e) => handleChangeFile(e)}
                />
                <label htmlFor="file">
                  <i className="fa-solid fa-paperclip icon"></i>
                </label>
              </div>
              <div
                className="chat-utilities-icon"
                onClick={() => setShowFormCard(true)}>
                <FormCard
                  userId={userId}
                  setVisible={setShowFormCard}
                  visible={showFormCard}
                  urlBackend={urlBackend}
                />

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
                  ref={inputRef}
                  className="chat-text-input"
                  type="text"
                  placeholder={`Nhập @, tin nhắn tới ${nameReceiver.name}`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                {image ? <img src={image} /> : ''}
              </div>
              <div className="chat-text-right">
                <div
                  className="chat-text-icon"
                  onClick={() => setDisplayIcons(!displayIcons)}>
                  <i
                    className="fa-regular fa-face-grin"
                    style={{
                      fontSize: '20px',
                      color: displayIcons ? '#0068ff' : '',
                    }}></i>
                  <div
                    className="content-icons"
                    style={{ display: displayIcons ? 'flex' : 'none' }}>
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
              width: isClickInfo ? '30%' : '',
              display: isClickInfo ? 'flex' : 'none',
              height: isClickInfo ? '100%' : '',
            }}>
            <div className="header">Thông tin hội thoại</div>
            <div className="header-info">
              <div className="header-info-avt">
                <img
                  src={
                    nameReceiver.image == null
                      ? '/public/avatardefault.png'
                      : nameReceiver.image
                  }
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                  }}
                />
              </div>
              <div className="header-info-name">
                <div className="user-name">{nameReceiver.name}</div>
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
              <div style={{ display: isClickDownMedia ? 'none' : '' }}>
                <div className="media-body">
                  <div className="frame"></div>
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
              <div style={{ display: isClickDownFile ? 'none' : '' }}>
                {contentMessages.map((message, index) => (
                  <div className="file-body" key={index}>
                    {message.message.includes(regexUrl) ? (
                      <ViewFile url={message.message} />
                    ) : (
                      <div className="frame">
                        {/* <div className="frame-left"></div>
                     <div className="frame-right">
                      <div className="frame-right-top">file.rar</div>
                      <div className="frame-right-bottom">
                        <div className="frame-weight">51.63 KB</div>
                        <div className="frame-date">30/01/2024</div>
                      </div>
                     </div> */}
                      </div>
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
              <div style={{ display: isClickDownLink ? 'none' : '' }}>
                <div className="link-body">
                  <div className="frame">
                    <div className="frame-left"></div>
                    <div className="frame-right">
                      <div className="frame-right-top">link</div>
                      <div className="frame-right-bottom">
                        <div className="frame-link">link.com</div>
                        <div className="frame-date">30/01/2024</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="btn">
                  <div className="btn-all">Xem tất cả</div>
                </div>
              </div>
            </div>
            <div className="group-setting" style={{ 'border-bottom': 'none' }}>
              <div className="setting-header">
                <span>Thiết lập bảo mật</span>
                <div onClick={() => setIsClickDownSetting(!isClickDownSetting)}>
                  {isClickDownSetting ? (
                    <FaCaretRight className="icon" />
                  ) : (
                    <FaCaretDown className="icon" />
                  )}
                </div>
              </div>
              <div
                className="setting-body"
                style={{ display: isClickDownSetting ? 'none' : '' }}>
                <div className="hidden-chat">
                  <BsEyeSlash className="icon" />
                  <span>Ẩn trò chuyện</span>
                  <BiSolidToggleLeft className="icon-toggle" />
                </div>
                <div className="delete-chat">
                  <LuTrash className="icon" />
                  <span>Xóa lịch sử trò chuyện</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* content chat */}
    </div>
  );
};

export default ContentChat;
