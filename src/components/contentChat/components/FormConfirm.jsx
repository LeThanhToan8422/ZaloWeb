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

function FormConfirm({visible, setVisible, group, socket, message}) {
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

  const onFinish = async () => {
    socket.emit(`Client-Dessolution-Group-Chats`, {
      group: group,
    });
  }
    return ( <Modal
        title={message}
        open={visibleModal}
        onOk={() => handleCancel()}
        onCancel={() => handleCancel()}
        width="23%"
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

export default FormConfirm;