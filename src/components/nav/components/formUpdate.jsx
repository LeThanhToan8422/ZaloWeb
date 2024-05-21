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

function FormUpdate({visible, setVisible, user, urlBackend, setUser}) {
  const { name = "", gender = "", dob = "" } = user;
  let setGender = gender? 1: 0;
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


  const onFinish = async (values) => {
    try {
      const { id } = user;
      values.id = id;
      const userUpdate = {
        ...values,
        dob: values["dob"] ? values["dob"].format("YYYY-MM-DD") : ""
      }
      const res = await axios.put(`${urlBackend}/users`, userUpdate)
      if(res){
        user.name = name
        user.gender = gender
        user.dob = dob
        message.success("Cập nhật thành công!")
        setUser(JSON.stringify(user))
        setVisible(false);
      }
    } catch (error) {
      console.log("Error: ", error);
      message.error(error.message);
    }
  }

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
                onFinish={onFinish}
                name="form_edit_account"
                className="ant-advanced-search-form"
                initialValues={{name: name, gender: setGender, dob: moment(dob)}}
              >
                <Row gutter={15}>
                  <Col lg={10}><b>Tên hiển thị</b></Col>
                  <Col lg={14} xs={24}>
                    <Form.Item
                      name="name"
                    >
                      <Input maxLength={100} />
                    </Form.Item>
                  </Col>             
                </Row>
              
                <Row gutter={15}>
                  <Col lg={10}><b>Giới tính</b></Col>
                  <Col lg={14} xs={24}>
                    <Form.Item
                      name="gender"
                    >
                     <Radio.Group >
                                <Radio value={1} >Nam</Radio>
                                <Radio value={0} >Nữ</Radio>
                      </Radio.Group>                   
                    </Form.Item>
                  </Col>                
                </Row>
                <Row gutter={15}>
                  <Col lg={10}><b>Ngày sinh</b></Col>
                  <Col lg={14} xs={24}>
                    <Form.Item
                      name="dob"
                    >
                      <DatePicker placeholder="" style={{ width: "100%" }} format="YYYY-MM-DD"/>
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