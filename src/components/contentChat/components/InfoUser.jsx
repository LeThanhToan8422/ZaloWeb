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
import FormUpdateName from "./formUpdateName";
import { CiTrash } from "react-icons/ci";
import { MdOutlineBlock } from "react-icons/md";
import moment from "moment";

function InfoUser({visible, setVisible, userId, urlBackend, friendId}) {
    const [form] = Form.useForm();
    const [visibleModal, setVisibleModal] = useState(false);
    const [user, setUser] = useState({});
    const [isClickUpdate, setIsClickUpdate] = useState(false);
    const [isBlock, setIsBlock] = useState(false);
    
    useEffect(() => {
        setVisibleModal(visible);
      }, [visible]);
    
    useEffect(() => {
    let getApiUserById = async () => {
      let datas = await axios.get(`${urlBackend}/users/${friendId}`);
      setUser(datas.data);
    };
    getApiUserById();
    }, [friendId]);

    const handleCancel = () => {
        form.resetFields();
        setVisibleModal(false);
    if (typeof setVisible === "function") {
      setVisible(false);
    }
    }

    let handleClickBlock = async () => {
        let dataBlock = await axios.post(`${urlBackend}/users/relationships`, {
          relationship: "block",
          id: userId, // id user của mình
          objectId: friendId, // id của user muốn kết bạn hoặc block
        });
        if (dataBlock.data) {
          setIsBlock(true);
        }
      };
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
                                <img src={user?.background=="null" ?"/public/anhbiadefault.jpg":user?.background} style={{width : "100%", height : "90px"}} alt="Ảnh bìa"/>
                              </Form.Item>
                              </Col>   
                          </Row>
                          <Row>
                              <Form.Item
                                name="avt"
                              >
                                <img src={user?.image=="null" ?"/public/avatardefault.png":user?.image} style={{width : "50px", height : "50px"}} alt="Ảnh đại diện"/>&nbsp;&nbsp;&nbsp; <b>{user?.name}</b>&nbsp;&nbsp;&nbsp; <EditOutlined style={{cursor: "pointer"}} onClick={() => setIsClickUpdate(true) }/>
                              </Form.Item>  
                          </Row>
                          <Row>                             
                              <Col lg={11} >
                              <Form.Item>
                                  <Button
                                      type="default"
                                      size="large"
                                      block
                                      
                                  >
                                      Gọi điện
                                  </Button>
                              </Form.Item>
                              </Col> 
                              <Col lg={2} >
                              </Col>
                              <Col lg={11}>
                              <Form.Item >
                                  <Button
                                      type="primary"
                                      size="large"
                                      block
                                  >
                                      Nhắn tin
                                  </Button>
                              </Form.Item>
                              </Col>   
                          </Row>
                          {/* <Row>
                              <Form.Item
                              >
                                  <b>Thông tin cá nhân</b>
                              </Form.Item>  
                          </Row> */}
                      
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
                                      {user?.gender? "Nam" : "Nữ"}
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
                                      {moment(user?.dob).format("YYYY-MM-DD")}
                                  </Form.Item>
                              </Col>              
                          </Row>
                          <Row  >
                              <Col lg={6} xs={6}>
                                  <Form.Item>
                                      <b>Điện thoại</b>
                                  </Form.Item>
                              </Col>   
                              <Col lg={18} xs={18}>
                                  <Form.Item
                                      name="phone"
                                  >
                                      {user?.phone}
                                  </Form.Item>
                              </Col>              
                          </Row>
                          <hr/>
                          <Row>                          
                          {isBlock ? (
              <Button
                type="text"
                size="large"
                block="true"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MdOutlineBlock size={20} />
                &nbsp;&nbsp;&nbsp;Bỏ chặn
              </Button>
            ) : (
              <Button
                type="text"
                size="large"
                block="true"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={handleClickBlock}
              >
                <MdOutlineBlock size={20} />
                &nbsp;&nbsp;&nbsp;Chặn tin nhắn và cuộc gọi
              </Button>
            )}
                          </Row>
                          <Row>                          
                            <Button
                              type="text"
                              size="large"
                              block="true"
                              style={{display:"flex", alignItems: "center", justifyContent: "center"}}
                            >
                              &nbsp;<CiTrash size={20} />&nbsp;&nbsp;&nbsp;Xóa khỏi danh sách bạn bè
                            </Button>
                          </Row>
                        </Form>
                  </Modal>
                  <FormUpdateName setVisible={setIsClickUpdate} visible={isClickUpdate} user={user}/>
        </div>
     );
}

export default InfoUser;