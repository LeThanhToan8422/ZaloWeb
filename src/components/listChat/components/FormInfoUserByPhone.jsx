import { useState, useEffect } from "react";

/*Components*/
import { Button, Form, Row, Col, Select, message, Modal } from "antd";
import axios from "axios";
import { EditOutlined } from "@ant-design/icons";
import { CiTrash } from "react-icons/ci";
import { MdOutlineBlock } from "react-icons/md";
import moment from "moment";
import { io } from "socket.io-client";
import FormConfirmDelete from "./FormConfirm";

function FormInfoUserByPhone({
  visible,
  setVisible,
  userId,
  friendId,
  urlBackend,
  isFriend,
  setRerender,
  setPhone,
  setIsFriend,
  handleSearch,
}) {
  const [form] = Form.useForm();
  const [visibleModal, setVisibleModal] = useState(false);
  const [friend, setfriend] = useState({});
  const [isClickUpdate, setIsClickUpdate] = useState(false);
  const [sendMakeFriend, setSendMakeFriend] = useState(false);
  const [isBlock, setIsBlock] = useState(false);
  const [socket, setSocket] = useState(null);
  const [render, setRender] = useState(false);
  const [isClickDelete, setIsClickDelete] = useState(false);

  useEffect(() => {
    let newSocket = io(`${urlBackend}`);
    setSocket(newSocket);
  }, [userId, friendId, JSON.stringify(isFriend)]);

  useEffect(() => {
    socket?.on(
      `Server-Make-Friends-${
        userId > friendId ? `${friendId}${userId}` : `${userId}${friendId}`
      }`,
      (dataGot) => {
        if (dataGot.data) {
          setSendMakeFriend(true);
          setIsFriend({
            id: dataGot.data.id,
            isFriends: "Đã gửi lời mời kết bạn",
          });
          setRerender((pre) => !pre);
        }
      }
    );

    socket?.on(
      `Server-Delete-Make-Friends-${
        userId > friendId ? `${friendId}${userId}` : `${userId}${friendId}`
      }`,
      (dataGot) => {
        setSendMakeFriend(false);
        setIsFriend({
          id: 0,
          isFriends: "0",
        });
      }
    );

    return () => {
      socket?.disconnect();
    };
  }, [userId, friendId, JSON.stringify(isFriend)]);

  useEffect(() => {
    setVisibleModal(visible);
  }, [visible]);

  useEffect(() => {
    let getApifriendById = async () => {
      let datas = await axios.get(`${urlBackend}/users/${friendId}`);
      setfriend(datas.data);
    };
    getApifriendById();
  }, [friendId, JSON.stringify(isFriend)]);

  const handleCancel = () => {
    form.resetFields();
    setVisibleModal(false);
    if (typeof setVisible === "function") {
      setVisible(false);
    }
  };

  let handleClickAddFriend = async () => {
    if (isFriend.isFriends === "0") {
      socket.emit(`Client-Make-Friends`, {
        content: "Mình kết bạn với nhau nhé!!!",
        giver: userId, // id user của mình
        recipient: friendId, // id của user muốn kết bạn hoặc block
        chatRoom:
          userId > friendId ? `${friendId}${userId}` : `${userId}${friendId}`,
      });
    } else if (isFriend.isFriends === "Đã gửi lời mời kết bạn") {
      socket.emit(`Client-Delete-Make-Friends`, {
        id: isFriend.id,
        chatRoom:
          userId > friendId ? `${friendId}${userId}` : `${userId}${friendId}`,
      });
    }
  };
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
      <FormConfirmDelete
        setVisible={setIsClickDelete}
        visible={isClickDelete}
        userId={userId}
        friendId={friendId}
        isFriend={isFriend}
        socket={socket}
        title={`Bạn có chắc chắn hủy kết bạn với ${friend?.name}`}
      />
      <Modal
        title="Thông tin tài khoản"
        open={visibleModal}
        onOk={() => handleCancel()}
        onCancel={() => handleCancel()}
        width="30%"
        footer={null}
        style={{
          display: isClickDelete ? 'none' : 'block'
        }}
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
                    friend?.background == "null"
                      ? "/public/anhbiadefault.jpg"
                      : friend?.background
                  }
                  style={{ width: "100%", height: "90px" }}
                  alt="Ảnh bìa"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Form.Item name="avt">
              <img
                src={
                  friend?.image == "null"
                    ? "/public/avatardefault.png"
                    : friend?.image
                }
                style={{ width: "50px", height: "50px" }}
                alt="Ảnh đại diện"
              />
              &nbsp;&nbsp;&nbsp; <b>{friend?.name}</b>&nbsp;&nbsp;&nbsp;{" "}
              <EditOutlined
                style={{ cursor: "pointer" }}
                onClick={() => setIsClickUpdate(true)}
              />
            </Form.Item>
          </Row>
          <Row>
            <Col lg={11}>
              <Form.Item>
                {isFriend.isFriends === true ? (
                  <Button type="default" size="large" block>
                    Gọi điện
                  </Button>
                ) : isFriend.isFriends === "Đã gửi lời mời kết bạn" ||
                  sendMakeFriend ? (
                  <Button
                    type="default"
                    size="large"
                    block
                    onClick={handleClickAddFriend}
                  >
                    Đã gửi lời mời kết bạn
                  </Button>
                ) : (isFriend.isFriends === '0' ? (
                  <Button
                    type="default"
                    size="large"
                    block
                    onClick={handleClickAddFriend}
                  >
                    Kết bạn
                  </Button>
                ) : (<Button
                  type="default"
                  size="large"
                  block
                  onClick={handleClickAddFriend}
                >
                  Bạn bè
                </Button>))
              }
              </Form.Item>
            </Col>
            <Col lg={2}></Col>
            <Col lg={11}>
              <Form.Item>
                <Button type="primary" size="large" block>
                  Nhắn tin
                </Button>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col lg={6} xs={6}>
              <Form.Item>
                <b>Giới tính</b>
              </Form.Item>
            </Col>
            <Col lg={18} xs={18}>
              <Form.Item name="gender">
                {friend?.gender ? "Nam" : "Nữ"}
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
              <Form.Item name="dob">
                {moment(friend?.dob).format("YYYY-MM-DD")}
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
              <Form.Item name="phone">{friend?.phone}</Form.Item>
            </Col>
          </Row>
          <hr />
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
          {isFriend.isFriends !== '0' ? (
            <Row>
              <Button
                type="text"
                size="large"
                block="true"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={()=>setIsClickDelete(true)}
              >
                &nbsp;
                <CiTrash size={20} />
                &nbsp;&nbsp;&nbsp;Xóa khỏi danh sách bạn bè
              </Button>
            </Row>
          ) : (
            ""
          )}
        </Form>
      </Modal>
    </div>
  );
}

export default FormInfoUserByPhone;
