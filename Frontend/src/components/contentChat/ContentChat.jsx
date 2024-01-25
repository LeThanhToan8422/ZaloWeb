import "../../sass/ContentChat.scss";
import { useState } from "react";
// import React, { useRef, useState } from 'react';
// Import Swiper React components
//import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


// import required modules
//import { Autoplay, Pagination, Navigation } from 'swiper/modules';

//import icon
import { SendOutlined, EditOutlined } from '@ant-design/icons';
import { LuSticker, LuAlarmClock } from "react-icons/lu";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { IoVideocamOutline, IoSearchOutline } from "react-icons/io5";
import { VscLayoutSidebarRightOff, VscLayoutSidebarRight } from "react-icons/vsc";
import { BsBell, BsPinAngle } from "react-icons/bs";
import { HiOutlineUsers } from "react-icons/hi2";


const ContentChat = () => {

  const [isClickInfo, setIsClickInfo] = useState(false);
  const [isClickSticker, setIsClickSticker] = useState(false);
  const [isClickLink, setIsClickLink] = useState(false);

  return (
    <div className="container-content-chat">
      {/* slide */}
      {/* <>
        <div className="slogan">
          <div className="slogan-title">Chào mừng đến với <b>Zalo PC</b>!</div>
          <p>Khám phá những tiện ích hỗ trợ làm việc và trò chuyện cùng <br/> người thân, bạn bè được tối ưu hóa cho máy tính của bạn</p>
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
            <img className="slide" alt="" src="/slide1.png"/>
            <div className="slide-title">Nhắn tin nhiều hơn, soạn thảo ít hơn</div>  
            <div className="slide-content">Sử dụng <b>Tin Nhắn Nhanh </b>để lưu sẵn các tin nhắn thường dùng và gửi nhanh trong hội thoại bất kỳ</div>  
          </SwiperSlide>
          <SwiperSlide>
            <img className="slide" alt="" src="/slide2.png"/>
            <div className="slide-title">Tin nhắn tự xóa</div>  
            <div className="slide-content">Từ giờ tin nhắn đã có thể tự động xóa sau khoảng thời gian nhất định.</div>  
          </SwiperSlide>
          <SwiperSlide>
            <img className="slide" alt="" src="/slide4.png"/>
            <div className="slide-title">Gọi nhóm và làm việc hiệu quả với Zalo Group Call</div>  
            <div className="slide-content">Trao đổi công việc mọi lúc mọi nơi</div>  
          </SwiperSlide>
          <SwiperSlide>
            <img className="slide" alt="" src="/slide5.png"/>
            <div className="slide-title">Trải nghiệm xuyên suốt</div>  
            <div className="slide-content">Kết nối và giải quyết công việc trên mọi thiết bị với dữ liệu luôn được đồng bộ</div>  
          </SwiperSlide>
          <SwiperSlide>
            <img className="slide" alt="" src="/slide6.png"/>
            <div className="slide-title">Gửi file nặng?</div>  
            <div className="slide-content">Đã có Zalo PC &quot;xử&quot; hết</div>  
          </SwiperSlide>
          <SwiperSlide>
            <img className="slide" alt="" src="/slide7.png"/>
            <div className="slide-title">Chat nhóm với đồng nghiệp</div>  
            <div className="slide-content">Tiện lợi hơn, nhờ các công cụ hỗ trợ chat trên máy tính</div>  
          </SwiperSlide>
          <SwiperSlide>
            <img className="slide" alt="" src="/slide8.png"/>
            <div className="slide-title">Giải quyết công việc hiệu quả hơn, lên đến 40%</div>  
            <div className="slide-content">Với Zalo PC</div>  
          </SwiperSlide>
        </Swiper>
      </> */}
      {/* content chat */}
      <div className="content-chat"
        style={ {width: isClickInfo ? "70%" : ""}}>
        <div className="chat-header">
          <div className="chat-header-left">
            <div className="chat-header-left-avt"><i className="fa-solid fa-user-tie icon"></i></div>
            <div className="chat-header-left-name">
              <div className="user">
                <div className="user-name">Le Thi Kim Ngan</div>
                <div className="user-edit"><EditOutlined /></div>
              </div>
              <div className="is-active">Active</div>
  
            </div>
          </div>
          <div className="chat-header-right">
            <div className="chat-header-right-icon"><AiOutlineUsergroupAdd className="icon"/></div>
            <div className="chat-header-right-icon"><IoSearchOutline className="icon"/>  </div>
            <div className="chat-header-right-icon"><IoVideocamOutline className="icon" /></div>
            <div className="chat-header-right-icon" 
                  onClick={() => setIsClickInfo(!isClickInfo)}
                  style={{color: isClickInfo ? "#0068ff" : "",
                          background: isClickInfo ? "#d4e4fa" : "",}}>
                            {isClickInfo ? <VscLayoutSidebarRight className="icon"/>:<VscLayoutSidebarRightOff className="icon"/>}
            </div>
          </div>
        </div>
        <div className="chat-view"></div>
        <div className="chat-utilities">
          <div className="chat-utilities-icon" 
                onClick={() => setIsClickSticker(!isClickSticker)}
                style={{color: isClickSticker ? "#0068ff" : "",
                        background: isClickSticker ? "#d4e4fa" : "",}}>
                      <LuSticker className="icon"/>
          </div>
          <div className="chat-utilities-icon"><i className="fa-regular fa-image icon"></i></div>
          <div className="chat-utilities-icon"
                onClick={() => setIsClickLink(!isClickLink)}
                style={{color: isClickLink ? "#0068ff" : "",
                        background: isClickLink ? "#d4e4fa" : "",}}>
                          <i className="fa-solid fa-paperclip icon"></i>
          </div>
          <div className="chat-utilities-icon"><i className="fa-regular fa-address-card icon"></i></div>
          <div className="chat-utilities-icon"><i className="fa-regular fa-clock icon"></i></div>
          <div className="chat-utilities-icon"><i className="fa-regular fa-square-check icon"></i></div>
        </div>
        <div className="chat-text">
          <div className="chat-text-left">
            <input className="chat-text-input" type="text" placeholder="Nhập @, tin nhắn tới Le Thi Kim Ngan" />
          </div>
          <div className="chat-text-right">
            <div className="chat-text-icon"><i className="fa-solid fa-at icon"></i></div>
            <div className="chat-text-icon"><SendOutlined className="icon"/></div>
          </div>
        </div>
      </div>
      {/* info chat */}
      <div className="chat-info"
        style={ {width: isClickInfo ? "30%" : "",
                display: isClickInfo ? "flex" : "none",
                height: isClickInfo ? "100%" : ""}}>
          <div className="header">Thông tin hội thoại</div>
          <div className="header-info">
            <div className="header-info-avt"><i className="fa-solid fa-user-tie icon"></i></div>
            <div className="header-info-name">
              <div className="user-name">Le Thi Kim Ngan</div>
              <div className="user-edit"><EditOutlined /></div>
            </div>
            <div className="header-info-utilities">
              <div className="notif">
                <BsBell className="icon"/><span>Tắt thông <br/> báo</span>
              </div>
              <div className="pin-chat">
                <BsPinAngle className="icon"/><span>Ghim hội <br/> thoại</span>
              </div>
              <div className="group-chat">
                <AiOutlineUsergroupAdd className="icon"/><span>Tạo nhóm <br/> trò chuyện</span>
              </div>
            </div>
          </div>
          <div className="chat-info-general">
            <div className="list-remider">
              <LuAlarmClock className="icon"/><span>Danh sách nhắc hẹn</span>
            </div>
            <div className="group-general">
              <HiOutlineUsers className="icon"/><span>0 nhóm chung</span>
            </div>
          </div>
          <div className="group-media"></div>
          <div className="group-file"></div>
          <div className="group-link"></div>
          <div className="group-setting"></div>
        </div>
  </div>
  )
}

export default ContentChat