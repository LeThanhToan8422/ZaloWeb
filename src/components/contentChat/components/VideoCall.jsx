import { useState, useEffect, useRef} from "react";
import { useLocation, useNavigate } from "react-router-dom";

/*Components*/
import {
  Button,
  Form,
  Input,
  Row,
  Col,
  Select,
  message,
  Modal,
  DatePicker,
  Radio
} from "antd";
import axios from "axios";
import moment from "moment";

import { MdCallEnd} from "react-icons/md";
import { IoVideocam , IoVideocamOff} from "react-icons/io5";
import { IoMdMic, IoMdMicOff } from "react-icons/io";
import Peer from "simple-peer";
import Sound from "react-sound";
import callSound from "../../../../public/nhac-cho.mp3";

function VideoCall({visible, setVisible, user, urlBackend}) {
  const { name, image } = user;
  const [form] = Form.useForm();
  const [visibleModal, setVisibleModal] = useState(false);
  const [isVideoCam, setIsVideoCam] = useState(true);
  const [isVoice, setIsVoice] = useState(true);
  const [peer, setPeer] = useState(null);
  const [stream, setStream] = useState(null);
  const videoRef = useRef();
  const incomingVideoRef = useRef();
  const [incomingStream, setIncomingStream] = useState(null);
  const [isCallSound, setIsCallSound] = useState(false);

  useEffect(() => {
    setVisibleModal(visible);
    if (visible) {
      startMedia();
     setIsCallSound(true);
    } else {
      stopMedia();
    setIsCallSound(false);

    }
  }, [visible]);

  useEffect(() => {
    if (peer) {
      peer.on("stream", (stream) => {
        setIncomingStream(stream);
        
      });
    }
  }, [peer]);

  const startMedia = async () => {
    try {
      const userMediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(userMediaStream);
      videoRef.current.srcObject = userMediaStream;
      const newPeer = new Peer({
        initiator: true,
        stream: userMediaStream,
        trickle: false,
      });
      newPeer.on("signal", (data) => {
        console.log("SIGNAL", JSON.stringify(data));
      });
      setPeer(newPeer);
    } catch (error) {
      console.error("Error accessing media devices.", error);
    }
  };

  const stopMedia = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      if (peer) {
        peer.destroy();
        setPeer(null);
      }
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setVisibleModal(false);
    if (typeof setVisible === "function") {
      setVisible(false);
    }
  };

  const toggleVideoCam = () => {
    setIsVideoCam(!isVideoCam);
    if (stream) {
      stream.getVideoTracks()[0].enabled = !isVideoCam;
    }
  };

  const toggleVoice = () => {
    setIsVoice(!isVoice);
    if (stream) {
      stream.getAudioTracks()[0].enabled = isVoice;
    }
  };
    return ( 
        <div>
            <Sound
            url={callSound}
            playStatus={isCallSound ? Sound.status.PLAYING : Sound.status.STOPPED}
            volume={50}
            autoLoad={true}
            loop={true}
          />
        <Modal
            title={`Zalo Call - ${name}`}
            open={visibleModal}
            onOk={() => handleCancel()}
            onCancel={() => handleCancel()}
            width="30%"
            footer={null}
            
        >
            <Row>
                        <Col lg={10}></Col>
                        <Col lg={4}>
                            <Form.Item
                                name="avt"
                            >
                                <img src={image=="null" || image==null ?"/public/avatardefault.png":image} style={{width : "50px", height : "50px"}} alt="Ảnh đại diện"/>
                            </Form.Item>  
                        </Col>
                        <Col lg={10}></Col>
                    </Row>
                    <Row>
                        <Col lg={24} >
                        <Form.Item style={{textAlign: "center"}} >
                        {`Đang đổ chuông ...`}
                        </Form.Item> 
                        </Col>
                    </Row>

                <Row gutter={16}>
              <Col span={12}>
                <video
                  ref={videoRef}
                  autoPlay
                 muted
                  style={{ width: "100%", height: "auto" }}
                ></video>
              </Col>
              <Col span={12}>
                {incomingStream && (
                  <video
                    ref={incomingVideoRef}
                    autoPlay
                    style={{ width: "100%", height: "auto" }}
                  ></video>
                )}
              </Col>
            </Row>
                    
                  
                    
                
                    <Row style={{display: 'flex', justifyContent: 'center', marginTop:"20px"}}>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around', width:"50%"}}>
                        <Button
                            className="btn-signin"
                            size="middle"
                            onClick={toggleVideoCam}
                          >
                            {isVideoCam? <IoVideocam />: <IoVideocamOff />}
                          </Button>
                          <Button
                            className="btn-signin"
                            style={{backgroundColor: 'red', color: 'white'}}
                            size="middle"
                            onClick={handleCancel}
                          >
                            <MdCallEnd />
                          </Button>
                          <Button
                            className="btn-signin"
                            size="middle"
                            onClick={toggleVoice}
                          >
                            {isVoice?<IoMdMic />:<IoMdMicOff />}
                          </Button>
                        </div>
                    </Row>
                    
            </Modal> 
        </div>);
}

export default VideoCall;