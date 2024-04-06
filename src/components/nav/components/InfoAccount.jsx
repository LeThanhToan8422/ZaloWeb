import { useState, useEffect } from "react";

/*Components*/
import { Button, Form, Row, Col, Select, message, Modal } from "antd";
import axios from "axios";
import { EditOutlined } from "@ant-design/icons";
import FormUpdate from "./formUpdate";
import { IoCameraOutline } from "react-icons/io5";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import FormChangePassword from "./FormUpdatePassword";
import { io } from "socket.io-client";

function InfoAccount({ visible, setVisible, userId }) {
  let navigate = useNavigate();
  const [form] = Form.useForm();
  const [visibleModal, setVisibleModal] = useState(false);
  const [user, setUser] = useState({});
  const [isClickUpdate, setIsClickUpdate] = useState(false);
  const [isClickChangePassword, setIsClickChangePassword] = useState(false);

  const [socket, setSocket] = useState(null);
  useEffect(() => {
    let newSocket = io("http://localhost:8080");
    setSocket(newSocket);
  }, [JSON.stringify(user), userId]);

  useEffect(() => {
    socket?.on(`Server-update-avatar-${userId}`, (dataGot) => {
      setUser(dataGot.data);
      setVisible(false)
      navigate("/home", {
        state: {
          userId: dataGot.data.id,
          rerender : dataGot.data.image
        },
      });
    });

    return () => {
      socket?.disconnect();
    };
  }, [JSON.stringify(user), userId]);

  useEffect(() => {
    socket?.on(`Server-update-background-${userId}`, (dataGot) => {
      setUser(dataGot.data);
      navigate("/home", {
        state: {
          userId: dataGot.data.id,
          rerender : dataGot.data.image
        },
      });
    });

    return () => {
      socket?.disconnect();
    };
  }, [JSON.stringify(user), userId]);

  useEffect(() => {
    setVisibleModal(visible);
  }, [visible]);

  useEffect(() => {
    let getApiUserById = async () => {
      let datas = await axios.get(`http://localhost:8080/users/${userId}`);
      setUser(datas.data);
    };
    getApiUserById();
  }, [userId, isClickUpdate]);

  const handleCancel = () => {
    form.resetFields();
    setVisibleModal(false);
    if (typeof setVisible === "function") {
      setVisible(false);
    }
  };

  let handleChangeFileAvatar = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const buffer = readerEvent.target.result;

      const reactFile = {
        fieldname: "image",
        originalname: file.name,
        encoding: "7bit",
        mimetype: file.type,
        buffer: buffer,
        size: file.size,
      };
      // TODO: Sử dụng đối tượng reactFile theo nhu cầu của bạn
      socket.emit(`Client-update-avatar`, {
        file: reactFile,
        id: userId,
      });
    };

    reader.readAsArrayBuffer(file);
  };

  let handleChangeFileBackground = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const buffer = readerEvent.target.result;

      const reactFile = {
        fieldname: "image",
        originalname: file.name,
        encoding: "7bit",
        mimetype: file.type,
        buffer: buffer,
        size: file.size,
      };
      // TODO: Sử dụng đối tượng reactFile theo nhu cầu của bạn
      socket.emit(`Client-update-background`, {
        file: reactFile,
        id: userId,
      });
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <Modal
        title="Thông tin tài khoản"
        open={visibleModal}
        onOk={() => handleCancel()}
        onCancel={() => handleCancel()}
        width="30%"
        style={{
          display: isClickUpdate || isClickChangePassword ? "none" : "block",
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
              <Form.Item name="background">
                <img
                  src={
                    user.background == "null"
                      ? "/public/anhbiadefault.jpg"
                      : user.background
                  }
                  style={{ width: "100%", height: "90px" }}
                  alt="Ảnh bìa"
                />
                <label
                    htmlFor="background"
                   style={{display: "flex", justifyContent: "flex-end"}}
                  >
                    <IoCameraOutline style={{ cursor: "pointer" }} />
                  </label>
                  <input
                    type="file"
                    accept=".png, .jpg, .jpeg, .gif, .bmp, .tiff"
                    multiple
                    style={{ display: "none" }}
                    id="background"
                    onChange={(e) => handleChangeFileBackground(e)}
                  />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <Form.Item>
                <div style={{ display: "flex" }}>
                  <img
                    src={
                      user.image == "null"
                        ? "/public/avatardefault.png"
                        : user.image
                    }
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                    }}
                    alt="Ảnh đại diện"
                  />

                  <label
                    htmlFor="image"
                    style={{ marginLeft: "-15px", marginTop: "45px" }}
                  >
                    <IoCameraOutline style={{ cursor: "pointer" }} />
                  </label>
                  <input
                    type="file"
                    accept=".png, .jpg, .jpeg, .gif, .bmp, .tiff"
                    multiple
                    style={{ display: "none" }}
                    id="image"
                    onChange={(e) => handleChangeFileAvatar(e)}
                  />
                </div>
              </Form.Item>
            </Col>
            <Col lg={12}>
              <Form.Item>
                &nbsp;&nbsp;&nbsp; <b>{user.name}</b>&nbsp;&nbsp;&nbsp;{" "}
                <EditOutlined onClick={() => setIsClickUpdate(true)} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Form.Item>
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
              <Form.Item name="gender">{user.gender ? "Nam" : "Nữ"}</Form.Item>
            </Col>
          </Row>
          <Row>
            <Col lg={6} xs={6}>
              <Form.Item>
                <b>Ngày sinh</b>
              </Form.Item>
            </Col>
            <Col lg={18} xs={18}>
              <Form.Item name="dob">
                {moment(user.dob).format("YYYY-MM-DD")}
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
              <Form.Item name="phone">{user.phone}</Form.Item>
            </Col>
          </Row>
          <Row>
            <Form.Item>
              <i>
                Chỉ bạn bè có lưu số của bạn trong danh bạ máy xem được số này
              </i>
            </Form.Item>
          </Row>
          <Row>
            <Button
              type="default"
              size="large"
              block="true"
              onClick={() => setIsClickUpdate(true)}
            >
              <EditOutlined /> Cập nhật
            </Button>
          </Row>
          <Row>
            <Button
              type="default"
              size="large"
              block="true"
              onClick={() => setIsClickChangePassword(true)}
            >
              <EditOutlined /> Đổi mật khẩu
            </Button>
          </Row>
        </Form>
      </Modal>
      <FormUpdate
        setVisible={setIsClickUpdate}
        visible={isClickUpdate}
        user={user}
      />
      <FormChangePassword
        setVisible={setIsClickChangePassword}
        visible={isClickChangePassword}
        userId={userId}
      />
    </div>
  );
}

export default InfoAccount;
