import { useState, useEffect } from "react";

/*Components*/
import { Button, Form, Row, Col, Select, message, Modal } from "antd";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import FormInfoUserByPhone from "./FormInfoUserByPhone";


function FormSearchFriendByPhone({ visible, setVisible, userId }) {
  const [form] = Form.useForm();
  const [visibleModal, setVisibleModal] = useState(false);
  const [user, setUser] = useState({});
  const [isClickSearch, setIsClickSearch] = useState(false);


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
      <Modal
        title="Thêm bạn"
        open={visibleModal}
        onOk={() => handleCancel()}
        onCancel={() => handleCancel()}
        width="30%"
        style={{
          display: isClickSearch ? "none" : "block",
        }}
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
                <PhoneInput country={"vn"}  />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col lg={13}></Col>
            <Col lg={5}>
                <Button
                  type="default"
                  size="large"
                  onClick={handleCancel}
                >
                   Hủy
                </Button>
            </Col>
            <Col lg={6}>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => setIsClickSearch(true)}
                >
                   Tìm kiếm
                </Button>
            </Col>            
          </Row>
        </Form>
      </Modal>
      <FormInfoUserByPhone 
        setVisible={setIsClickSearch}
        visible={isClickSearch}
        userId={userId}/>
    </div>
  );
}

export default FormSearchFriendByPhone;
