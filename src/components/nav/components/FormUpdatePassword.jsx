import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";

/*Components*/
import {
  Button,
  Form,
  Input,
  Row,
  Col,
  message,
  Modal,
} from "antd";
import axios from "axios";

function FormChangePassword({visible, setVisible, userId, urlBackend}) {
  let salt = bcrypt.genSaltSync(10);
  let navigate = useNavigate();
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

  const validatePassword = (_, value) => {
    // Check for at least 8 characters, one uppercase, one lowercase, one digit, and one special character
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(value)) {
      return Promise.reject('Mật khẩu cần ít nhất 8 kí tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.');
    }
    return Promise.resolve();
  };

  // Custom validation function for matching passwords
  const validateConfirmPassword = (_, value) => {
    if (value !== form.getFieldValue('password')) {
      return Promise.reject('Mật khẩu không trùng khớp.');
    }
    return Promise.resolve();
  };

  const onFinish = async (values) => {
    try {
      let datas = await axios.get(
              `${urlBackend}/accounts/user/${userId}`
            );
            if (datas.data) {
                    if (bcrypt.compareSync(values.oldPassword, datas.data.password)) {
                      let hashPassword = bcrypt.hashSync(values.password, salt);
                      await axios.put(`${urlBackend}/accounts`, {
                        id: datas.data.id,
                        phone: datas.data.phone,
                        password: hashPassword,
                      });
                      navigate("/");
                    }
                    else{
                      message.error("Mật khẩu cũ không chính xác!!!")
                    }
                  }
    } catch (error) {
      console.log("Error: ", error);
      message.error(error.message);
    }
  }

    return ( 
    <Modal
        title="Đổi mật khẩu"
        open={visibleModal}
        onOk={() => handleCancel()}
        onCancel={() => handleCancel()}
        width="30%"
        footer={null}
        
    >
              <Form
                form={form}
                onFinish={onFinish}
                className="ant-advanced-search-form"
              >
                <Row gutter={15}>
                  <Col lg={10}><b>Mật khẩu cũ</b></Col>
                  <Col lg={14} xs={24}>
                    <Form.Item
                      name="oldPassword"
                      rules={[{ required: true, message: "Bạn chưa nhập mật khẩu cũ" }]}
                    >
                      <Input maxLength={100} type="password" addonAfter={<span style={{color: "red"}}>*</span>}/>
                    </Form.Item>
                  </Col>             
                </Row>
              
                <Row gutter={15}>
                  <Col lg={10}><b>Mật khẩu mới</b></Col>
                  <Col lg={14} xs={24}>
                    <Form.Item
                      required
                      name="password"
                      rules={[{ required: true, message: "Bạn chưa nhập mật khẩu mới" },
                      { validator: validatePassword }]}
                    >
                     <Input maxLength={100} type="password" addonAfter={<span style={{color: "red"}}>*</span>}/>               
                    </Form.Item>
                  </Col>                
                </Row>
                <Row gutter={15}>
                  <Col lg={10}><b>Xác nhận mật khẩu mới</b></Col>
                  <Col lg={14} xs={24}>
                    <Form.Item
                      rules={[{ required: true, message: "Bạn chưa nhập xác nhận mật khẩu mới" },
                      { validator: validateConfirmPassword }]}
                      name="verifyPassword"
                    >
                      <Input maxLength={100} type="password" addonAfter={<span style={{color: "red"}}>*</span>}/>
                    </Form.Item>
                  </Col>                
                </Row>
                <div>
                  <Button
                    className="btn-signin"
                    type="light"
                    size="large"
                    onClick={handleCancel}
                  >
                    Hủy
                  </Button>
                  <Button
                    className="btn-signin"
                    htmlType="submit"
                    type="primary"
                    size="large"
                  >
                    Cập nhật
                  </Button>
                </div>
              </Form>
        </Modal> );
}

export default FormChangePassword;