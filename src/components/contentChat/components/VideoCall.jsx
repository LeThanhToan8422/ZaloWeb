import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const VideoCall = () => {
  const { roomId } = useParams();

  const myMeeting = async(element) => {
    const appID = 1077439513;
    const serverSecret = "ffaa6660bd7cdd0483d89a2981a16372"
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomId, Date.now().toString(), "Zalo_Team_6");
    const zc = ZegoUIKitPrebuilt.create(kitToken)
    zc.joinRoom({
        container : element,
        sharedLinks : [{
            name : "Copy Link",
            url : `http://localhost:5173/video-call/room/${roomId}`
        }],
        scenario : {
            mode : ZegoUIKitPrebuilt.OneONoneCall,
        },
        showScreenSharingButton : false
    })
  }

  return <div>
    <div ref={myMeeting}></div>
  </div>;
};

export default VideoCall;
