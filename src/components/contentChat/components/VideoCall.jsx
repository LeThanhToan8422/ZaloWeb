import { useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const VideoCall = () => {
  const { name, roomId } = useParams();
  const navigate = useNavigate();
  const meetingRef = useRef(null);

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
        navigate(-1);
      },
    });
  }, [roomId, name, navigate]);

  return <div ref={meetingRef}></div>;
};

export default VideoCall;
