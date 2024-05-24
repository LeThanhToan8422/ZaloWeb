import { useState, useEffect} from "react";

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

function FormConfirmDelete({visible, setVisible, userId, friendId, socket, title, isFriend}) {
  const [form] = Form.useForm();
  const [visibleModal, setVisibleModal] = useState(false);
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

  const onFinish = () => {
    socket.emit(`Client-Update-Friends`, {
      userId: userId,
      friendId: friendId,
      chatRoom:
        userId > friendId ? `${friendId}${userId}` : `${userId}${friendId}`,
    });
    isFriend.isFriends = '0'
    message.success('Xóa thành công!')
    setVisible(false)
  }
    return ( <Modal
        title={title}
        open={visibleModal}
        onOk={() => handleCancel()}
        onCancel={() => handleCancel()}
        width="30%"
        footer={[
            <Button key="back" onClick={handleCancel} size="large">
              Hủy
            </Button>,
            <Button
            key="submit"
            type="primary"
            size="large"
            onClick={onFinish}
          >
            Xác nhận
          </Button>
          ]}
        
    >
              <Form
                form={form}
               // onFinish={onFinish}
              >
              </Form>
        </Modal> );
}

export default FormConfirmDelete;