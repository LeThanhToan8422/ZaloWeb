import { useState, useEffect} from "react";

/*Components*/
import {
  Button,
  Form,
  Row,
  Col,
  Select,
  message,
  Modal
} from "antd";
import axios from "axios";
import {  EditOutlined } from "@ant-design/icons";
import FormUpdate from "./formUpdate";

function InfoAccount({visible, setVisible, userId}) {
    const [form] = Form.useForm();
    const [visibleModal, setVisibleModal] = useState(false);
    const [user, setUser] = useState({});
    const [isClickUpdate, setIsClickUpdate] = useState(false);
    console.log(user);
    useEffect(() => {
        setVisibleModal(visible);
      }, [visible]);
    
    useEffect(() => {
    let getApiUserById = async () => {
      let datas = await axios.get(`http://localhost:8080/user/${userId}`);
      setUser(datas.data);
    };
    getApiUserById();
    }, [userId]);

    const handleCancel = () => {
        form.resetFields();
        setVisibleModal(false);
    if (typeof setVisible === "function") {
      setVisible(false);
    }
    }

    return ( 
           <div>
                <Modal
                title="Thông tin tài khoản"
                open={visibleModal}
                onOk={() => handleCancel()}
                onCancel={() => handleCancel()}
                width="30%"
                style={{display: isClickUpdate?"none":"block"}}
                footer={null}
            >
                      <Form
                        form={form}
                        name="form_info_account"
                        className="ant-advanced-search-form"
                      >
                        <Row>
                            <Col lg={24} xs={24}>
                            <Form.Item
                              name="background"
                            >
                              <img src={user.background} style={{width : "100%", height : "90px"}} alt="Ảnh bìa"/>
                            </Form.Item>
                            </Col>   
                        </Row>
                        <Row>
                            <Form.Item
                              name="avt"
                            >
                              <img src={user.image} style={{width : "50px", height : "50px"}} alt="Ảnh đại diện"/>&nbsp;&nbsp;&nbsp; <b>{user.name}</b>&nbsp;&nbsp;&nbsp; <EditOutlined />
                            </Form.Item>  
                        </Row>
                        <Row>
                            <Form.Item
                            >
                                <b>Thông tin cá nhân</b>
                            </Form.Item>  
                        </Row>
                    
                        <Row>
                            <Col lg={6} xs={6}>
                                <Form.Item>
                                    <b>Giới tính</b>
                                </Form.Item>
                            </Col>   
                            <Col lg={18} xs={18}>
                                <Form.Item
                                    name="gender"
                                >
                                    {user.gender? "Nam" : "Nữ"}
                                </Form.Item>
                            </Col>              
                        </Row>
                        <Row>
                            <Col lg={6} xs={6}>
                                <Form.Item>
                                    <b>Ngày sinh</b>
                                </Form.Item>
                            </Col>   
                            <Col lg={18} xs={18}>
                                <Form.Item
                                    name="dob"
                                >
                                    {user.dob}
                                </Form.Item>
                            </Col>              
                        </Row>
                        <Row>
                            <Col lg={6} xs={6}>
                                <Form.Item>
                                    <b>Điện thoại</b>
                                </Form.Item>
                            </Col>   
                            <Col lg={18} xs={18}>
                                <Form.Item
                                    name="phone"
                                >
                                    {user.phone}
                                </Form.Item>
                            </Col>              
                        </Row>
                        <Row><Form.Item><i>Chỉ bạn bè có lưu số của bạn trong danh bạ máy xem được số này</i></Form.Item></Row>
                        <Row>
                          
                          <Button
                            type="default"
                            size="large"
                            block="true"
                            onClick={() => setIsClickUpdate(true) }
                          >
                           <EditOutlined /> Cập nhật 
                          </Button>
                        </Row>
                      </Form>
                </Modal> 
                <FormUpdate setVisible={setIsClickUpdate} visible={isClickUpdate} user={user}/>
           </div>
     );
}

export default InfoAccount;