import { useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const VoiceCall = () => {
  const { name, roomId } = useParams();
  const navigate = useNavigate();
  const meetingRef = useRef(null);
  const zcRef = useRef(null);

  useEffect(() => {
    const appID = 802507212;
    const serverSecret = "da1f6aeae7236915d780622fdbfbeaf5";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      Date.now().toString(),
      name
    );
    const zc = ZegoUIKitPrebuilt.create(kitToken);
    zcRef.current = zc;

    zc.joinRoom({
      container: meetingRef.current,
      sharedLinks: [
        {
          name: "Copy Link",
          url: `http://localhost:5173/voice-call/room/${roomId}`,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
        audio: true,
        video: false
      },
      turnOnCameraWhenJoining: false,
      showMyCameraToggleButton: false,
      showScreenSharingButton: false,
      showPreJoinView: false,
      showLeaveRoomConfirmDialog: false,
      showAudioVideoSettingsButton: false,
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
  }, [roomId, name, navigate]);

  return <div ref={meetingRef} style={{ width: '100vw', height: '100vh', backgroundColor: "#ffffff" }}></div>;
};

export default VoiceCall;
