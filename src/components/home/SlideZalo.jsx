import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";

const SlideZalo = () => {
  return (
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
              Sử dụng <b>Tin Nhắn Nhanh </b>để lưu sẵn các tin nhắn thường dùng
              và gửi nhanh trong hội thoại bất kỳ
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
              Kết nối và giải quyết công việc trên mọi thiết bị với dữ liệu luôn
              được đồng bộ
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
  );
};

export default SlideZalo;
