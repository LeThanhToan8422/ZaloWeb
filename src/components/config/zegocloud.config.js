import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { ZIM } from "zego-zim-web";

let zegocloudConfig = (user) => {
    const appID = 1851922968;
    const serverSecret = "43324c1a6997f3e8dbcc5d74b3541a4c";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      null,
      user.id+"",
      user.name
    );
    const zc = ZegoUIKitPrebuilt.create(kitToken);
    zc.addPlugins({ ZIM });
    zc.setCallInvitationConfig({
        ringtoneConfig: {
         incomingCallUrl: 'Nhac-chuong-cuoc-goi-Zalo.mp3',
         outgoingCallUrl: 'nhac-chuong-rong-den-remix-tiktok.mp3' // The ringtone when sending a call invitation. 
       }
     })

    return zc
}

export default zegocloudConfig