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
import moment from "moment";

function FormUpdateName({visible, setVisible, user, urlBackend}) {
  const { name, image } = user;
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
    return ( <Modal
        title="Đặt tên gợi nhớ"
        open={visibleModal}
        onOk={() => handleCancel()}
        onCancel={() => handleCancel()}
        width="30%"
        footer={null}
        
    >
              <Form
                form={form}
                //onFinish={onFinish}
                name="form_edit_name"
                className="ant-advanced-search-form"
                initialValues={{name: name}}
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
                    Hãy đặt cho&nbsp;<b>{name}</b>&nbsp;một cái tên dễ nhớ. <br/> Lưu ý: Tên gợi nhớ sẽ chỉ hiển thị riêng với bạn.    
                    </Form.Item> 
                    </Col>
                </Row>
                <Row gutter={15}>
                  <Col lg={24} xs={24}>
                    <Form.Item
                      name="name"
                    >
                      <Input maxLength={100} />
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
                    Xác nhận
                  </Button>
                </div>
              </Form>
        </Modal> );
}

export default FormUpdateName;