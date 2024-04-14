import { useState, useEffect } from "react";

/*Components*/
import { Button, Form, Row, Col, Select, message, Modal } from "antd";
import toast, { Toaster } from "react-hot-toast";
import { io } from "socket.io-client";
import moment from "moment";

function FormDeleteChat({
  visible,
  setVisible,
  userId,
  objectId,
  urlBackend,
  setRerender,
  setDeleteChat
}) {
  console.log(objectId);
  const [form] = Form.useForm();
  const [visibleModal, setVisibleModal] = useState(false);
  const [socket, setSocket] = useState(null);
  const [render, setRender] = useState(false);

  useEffect(() => {
    let newSocket = io(`${urlBackend}`);
    setSocket(newSocket);
  }, [userId, JSON.stringify(objectId), render]);

  useEffect(() => {
    socket?.on(
      `Server-Delete-Chat-${userId}`,
      (dataGot) => {
        handleCancel()
        setDeleteChat("")
        setRerender(pre => !pre)
        toast.success("Xóa thành công")
      }
    );

    return () => {
      socket?.disconnect();
    };
  }, [userId, JSON.stringify(objectId), render]);


  useEffect(() => {
    setVisibleModal(visible);
  }, [visible]);

  const handleCancel = () => {
    form.resetFields();
    setVisibleModal(false);
    if (typeof setVisible === "function") {
      setVisible(false);
    }
  };

  let handleClickDeleteChat = () => {
    socket.emit(`Client-Delete-Chat`, {
      dateTimeSend: moment().utcOffset(7).format("YYYY-MM-DD HH:mm:ss"),
      implementer: userId,
      chat: objectId.phone ? objectId.id : null,
      groupChat: objectId.leader ? objectId.id : null,
    });
    setRender(!render)
  };

  return (
    <div>
      <Toaster toastOptions={{ duration: 4000 }} />
      <Modal
        title="Xác nhận"
        open={visibleModal}
        onOk={() => handleCancel()}
        onCancel={() => handleCancel()}
        width="30%"        
        footer={null}
      >
        <Form
          form={form}
          name="form_info_account"
          className="ant-advanced-search-form"
        >
          <Row>
            <Col lg={24} xs={24}>
              <Form.Item name="phone">
                Toàn bộ nội dung trò chuyện sẽ bị xóa vĩnh viễn. <br/> Bạn có chắc chắn muốn xóa?
              </Form.Item>
            </Col>
          </Row>          
          <Row>
            <Col lg={13}></Col>
            <Col lg={5}>
              <Button type="default" size="large" onClick={handleCancel}>
                Không
              </Button>
            </Col>
            <Col lg={6}>
              <Button type="primary" size="large" onClick={handleClickDeleteChat}>
                Xóa
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}

export default FormDeleteChat;
