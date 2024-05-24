import { useState, useEffect} from "react";

/*Components*/
import {
  Button,
  Form,
  Input,
  Row,
  Col,
  Modal,
} from "antd";

function FormChangeNameGroup({socket, visible, setVisible, group, urlBackend, setIsReloadPage}) {
  const [form] = Form.useForm();
  const [visibleModal, setVisibleModal] = useState(false);
  const [nameChange, setNameChange] = useState("")

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

  let handleClickVerifyChangeNameGroup = () => {
    group.name = nameChange;
    socket.emit(`Client-Change-Name-Or-Image-Group-Chats`, {
      group: group,
    });
    setIsReloadPage(pre => !pre)
    setVisible(false)
  }
    return ( <Modal
        title="Đổi tên nhóm"
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
            onClick={handleClickVerifyChangeNameGroup}
          >
            Xác nhận
          </Button>
          ]}
        
    >
              <Form
                form={form}
                // onFinish={onFinish}
                name="form_edit_name"
                className="ant-advanced-search-form"
                initialValues={{name: group?.name}}
              >
                <Row>
                    <Col lg={10}></Col>
                    <Col lg={4}>
                        <Form.Item
                            name="avt"
                        >
                            <img src={group?.image=="null" || group?.image==null ?"/public/avatardefault.png":group?.image} style={{width : "50px", height : "50px", borderRadius: "50%"}} alt="Ảnh đại diện"/>
                        </Form.Item>  
                    </Col>
                    <Col lg={10}></Col>
                </Row>
                <Row>
                    <Col lg={24} >
                    <Form.Item style={{textAlign: "center"}} >
                    Bạn có chắc chắn muốn đổi tên nhóm, khi xác nhận tên <br/> nhóm mới sẽ hiển thị với tất cả thành viên.    
                    </Form.Item> 
                    </Col>
                </Row>
                <Row gutter={15}>
                  <Col lg={24} xs={24}>
                    <Form.Item
                      name="name"
                    >
                      <Input maxLength={100} onChange={(e) => setNameChange(e.target.value)}/>
                    </Form.Item>
                  </Col>             
                </Row>
              </Form>
        </Modal> );
}

export default FormChangeNameGroup;