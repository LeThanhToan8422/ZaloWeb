import { useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const VideoCall = () => {
  const { name, roomId } = useParams();
  const navigate = useNavigate();
  const meetingRef = useRef(null);
  const zcRef = useRef(null); // Thêm một ref để lưu trữ thể hiện của ZegoUIKitPrebuilt

  useEffect(() => {
    const appID = 1077439513;
    const serverSecret = "ffaa6660bd7cdd0483d89a2981a16372";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      Date.now().toString(),
      name
    );
    const zc = ZegoUIKitPrebuilt.create(kitToken);
    zcRef.current = zc; // Lưu trữ thể hiện của ZegoUIKitPrebuilt vào ref

    zc.joinRoom({
      container: meetingRef.current,
      sharedLinks: [
        {
          name: "Copy Link",
          url: `http://localhost:5173/video-call/room/${roomId}`,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      showScreenSharingButton: false,
      showPreJoinView: false,
      showLeaveRoomConfirmDialog: false,
      onLeaveRoom: () => {
        // Khi một trong hai bên kết thúc cuộc gọi, hủy bỏ thể hiện của ZegoUIKitPrebuilt
        zcRef.current.destroy();
        // Di chuyển người dùng đến trang trước đó hoặc trang chính
        navigate(-1);
      },
      onUserLeave: (users) => {
        // Khi một người dùng rời khỏi phòng, cũng kết thúc cuộc gọi
        if (users.length === 1) { // Kiểm tra nếu chỉ còn một người dùng trong phòng
          zcRef.current.destroy();
          navigate(-1); // Di chuyển người dùng đến trang trước đó hoặc trang chính
        }
      }
    });

    // Clean up
    return () => {
      if (zcRef.current) {
        zcRef.current.destroy();
      }
    };
  }, [roomId, name, navigate]);

  return <div ref={meetingRef}></div>;
};

export default VideoCall;
