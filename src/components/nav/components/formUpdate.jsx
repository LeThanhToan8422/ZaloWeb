import { useState, useEffect} from "react";
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
function FormUpdate({visible, setVisible, user}) {
  const { name, gender, dob } = user;
  console.log(gender);
  console.log(dob);
  const [form] = Form.useForm();
  let location = useLocation();
  const { Option } = Select;
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
    return ( <Modal
        title="Cập nhật thông tin cá nhân"
        open={visibleModal}
        onOk={() => handleCancel()}
        onCancel={() => handleCancel()}
        width="30%"
        footer={null}
        
    >
              <Form
                form={form}
                //onFinish={onFinish}
                name="form_edit_account"
                className="ant-advanced-search-form"
              >
                <Row gutter={15}>
                  <Col lg={24} xs={24}>
                    <Form.Item
                      label="Tên hiển thị"
                      name="showName"
                      rules={[
                        { required: true, message: "Bạn chưa nhập tên!" },
                      ]}
                    >
                      <Input maxLength={100} defaultValue={name}/>
                    </Form.Item>
                  </Col>             
                </Row>
              
                <Row>
                  <Col lg={24} xs={24}>
                    <Form.Item
                      label="Giới tính"
                      name="gender"
                    >
                      {gender ? <Radio.Group >
                                <Radio value={1} >Nam</Radio>
                                <Radio value={0} defaultChecked>Nữ</Radio>
                              </Radio.Group>: 
                              <Radio.Group >
                                <Radio value={1} defaultChecked>Nam</Radio>
                                <Radio value={0} >Nữ</Radio>
                              </Radio.Group>
                              
                      }                      
                    </Form.Item>
                  </Col>                
                </Row>
                <Row>
                  <Col lg={24} xs={24}>
                    <Form.Item
                      label="Ngày sinh"
                      name="dob"
                    >
                      <DatePicker placeholder="" />
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

export default FormUpdate;