import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/*Components*/
import { Button, Form, Row, Col, Modal } from "antd";

import { MdCall, MdCallEnd } from "react-icons/md";
import Sound from "react-sound";
import callSound from "../../../../public/nhac-cho.mp3";
import receiverSound from "../../../../public/Nhac-chuong-cuoc-goi-Zalo.mp3";

function FormVideoCall({
  visible,
  setVisible,
  user,
  idZoom,
  nameCall,
  isReceiverTheCall,
  isVideoCall,
  socket,
}) {
  const { name, image } = user;
  const [form] = Form.useForm();
  const [visibleModal, setVisibleModal] = useState(false);
  const [isCallSound, setIsCallSound] = useState(false);

  useEffect(() => {
    setVisibleModal(visible);
    if (visible) {
      setIsCallSound(true);
    } else {
      setIsCallSound(false);
    }
  }, [visible]);

  const handleCancel = () => {
    socket?.emit("Client-Answer-Video-Call", {
      isAnswer: false,
      isTurnOff: true,
      idZoom: idZoom,
      isVideoCall: isVideoCall
    });
    form.resetFields();
    setVisibleModal(false);
    if (typeof setVisible === "function") {
      setVisible(false);
    }
  };

  let handleClickAnswerVideoCall = () => {
    socket?.emit("Client-Answer-Video-Call", {
      isAnswer: true,
      isTurnOff: false,
      idZoom: idZoom,
      isVideoCall: isVideoCall
    });
  };

  return (
    <div>
      {isReceiverTheCall ? (
        <Sound
          url={receiverSound}
          playStatus={
            isReceiverTheCall ? Sound.status.PLAYING : Sound.status.STOPPED
          }
          volume={50}
          autoLoad={true}
          loop={true}
        />
      ) : (
        <Sound
          url={callSound}
          playStatus={isCallSound ? Sound.status.PLAYING : Sound.status.STOPPED}
          volume={50}
          autoLoad={true}
          loop={true}
        />
      )}

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
            <Form.Item name="avt">
              <img
                src={
                  image == "null" || image == null
                    ? "/public/avatardefault.png"
                    : image
                }
                style={{ width: "50px", height: "50px" }}
                alt="Ảnh đại diện"
              />
            </Form.Item>
          </Col>
          <Col lg={10}></Col>
        </Row>
        <Row>
          <Col lg={24}>
            <Form.Item style={{ textAlign: "center" }}>
              {`Đang đổ chuông ...`}
            </Form.Item>
          </Col>
        </Row>

        <Row
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              width: "30%",
            }}
          >
            {isReceiverTheCall && (
              <Button
                className="btn-signin"
                style={{ backgroundColor: "green", color: "white" }}
                size="middle"
                onClick={handleClickAnswerVideoCall}
              >
                <MdCall />
              </Button>
            )}
            <Button
              className="btn-signin"
              style={{ backgroundColor: "red", color: "white" }}
              size="middle"
              onClick={handleCancel}
            >
              <MdCallEnd />
            </Button>
          </div>
        </Row>
      </Modal>
    </div>
  );
}

export default FormVideoCall;
