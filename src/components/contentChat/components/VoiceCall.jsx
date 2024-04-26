import { useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const VoiceCall = () => {
  const { name, roomId } = useParams();
  const navigate = useNavigate();
  const meetingRef = useRef(null);

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

export default VoiceCall;
