import { useState, useEffect } from "react";

/*Components*/
import { Button, Form, Row, Col, Select, message, Modal } from "antd";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function FormDeleteChat({
  visible,
  setVisible,
  userId,
  urlBackend,
  setRerender
}) {
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
              <Button type="primary" size="large">
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
