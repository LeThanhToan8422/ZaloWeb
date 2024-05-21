import { useState, useEffect } from "react";

/*Components*/
import { Button, Form, Row, Col, Select, message, Modal } from "antd";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import FormInfoUserByPhone from "./FormInfoUserByPhone";
import toast, { Toaster } from "react-hot-toast";
import { io } from 'socket.io-client';
import moment from "moment";

function FormSearchFriendByPhone({
  visible,
  setVisible,
  userId,
  urlBackend,
  makeFriends,
  setRerender
}) {
  const [form] = Form.useForm();
  const [visibleModal, setVisibleModal] = useState(false);
  const [friend, setFriend] = useState({});
  const [isClickSearch, setIsClickSearch] = useState(false);
  const [phone, setPhone] = useState("");
  const [socket, setSocket] = useState(null);
  const [friendAgree, setFriendAgree] = useState(null);
  const [isFriend, setIsFriend] = useState(0);

  useEffect(() => {
    let newSocket = io(`${urlBackend}`);
    setSocket(newSocket);
  }, [JSON.stringify(friendAgree)]);

  useEffect(() => {
    socket?.on(
      `Server-Chat-Room-${
        userId > friendAgree?.id ? `${friendAgree?.id}${userId}` : `${userId}${friendAgree?.id}`
      }`,
      (dataGot) => {
        setRerender(pre => !pre)
        toast.success("Thêm Bạn Bè thành công!!!");
      }
    );

    return () => {
      socket?.disconnect();
    };
  }, [JSON.stringify(friendAgree)]);

  let handleSearch = async () => {
    let datas = await axios.get(
      `${urlBackend}/accounts/phone/0${phone.slice(2, 11)}`
    );
    if (datas.data) {
      setFriend(datas.data.user);
      setIsClickSearch(true);
      setVisible(false);

      let dts = await axios.get(
        `${urlBackend}/users/check-is-friend/${userId}/${datas.data.user}`
      );
      console.log(dts.data);
      if(Number(dts.data) === 0){
        setIsFriend({
          id : 0,
          isFriends : "0"
        })
      }
      else{
        setIsFriend(dts.data)
      }
    } else {
      message.error("Số điện thoại chưa được đăng ký!");
    }
  };

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

  let handleClickAgreeMakeFriend = async (user) => {
    setFriendAgree(user)
    let dataDelete = await axios.delete(
      `${urlBackend}/make-friends/${user.makeFriendId}`
    );
    if (dataDelete.data) {
      let dataAddFriend = await axios.post(
        `${urlBackend}/users/relationships`,
        {
          relationship: "friends",
          id: userId, // id user của mình
          objectId: user.id, // id của user muốn kết bạn hoặc block
        }
      );
      if (dataAddFriend.data) {
        socket.emit(`Client-Chat-Room`, {
          message: `Bạn và ${user.name} đã trở thành bạn`,
          dateTimeSend : moment().format('YYYY-MM-DD HH:mm:ss'),
          sender: userId,
          receiver: user.id,
          chatRoom: userId > user.id ? `${user.id}${userId}` : `${userId}${user.id}`,
        });
      }
    }
  };

  return (
    <div>
      <Toaster toastOptions={{ duration: 4000 }} />
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
                <PhoneInput country={"vn"} value={phone} onChange={setPhone} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col lg={24} xs={24}>
              {makeFriends?.map((u) => (
                <div
                  className="user-chat"
                  key={u.id}
                  // onClick={() => handleClickChat(chat.id)}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    border: "1px dashed gray",
                    marginBottom: "5px",
                    padding:"5px"
                  }}
                >
                  <img
                    src={
                      u.image == "null" ? "/public/avatardefault.png" : u.image
                    }
                    style={{
                      height: 45,
                      width: 45,
                      borderRadius: 50,
                    }}
                  />
                  <div style={{ display: "flex",flexDirection: "row", marginLeft: 10}}>
                    <div 
                     style={{  fontSize: 18}}
                    >
                      {u.name}
                    </div>
                    <Button 
                      style={{marginLeft:"160px"}}
                      type="text"
                      onClick={() =>
                        handleClickAgreeMakeFriend(u)
                      }
                    >
                      Đồng ý
                    </Button>
                  
                  </div>
                </div>
              ))}
            </Col>
          </Row>
          <Row style={{marginTop:"20px"}}>
            <Col lg={13}></Col>
            <Col lg={5}>
              <Button type="default" size="large" onClick={handleCancel}>
                Hủy
              </Button>
            </Col>
            <Col lg={6}>
              <Button type="primary" size="large" onClick={handleSearch}>
                Tìm kiếm
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
      <FormInfoUserByPhone
        setVisible={setIsClickSearch}
        visible={isClickSearch}
        userId={userId}
        friendId={friend}
        urlBackend={urlBackend}
        isFriend={isFriend}
        setRerender={setRerender}
        setPhone={setPhone}
        setIsFriend={setIsFriend}
        handleSearch={handleSearch}
      />
    </div>
  );
}

export default FormSearchFriendByPhone;
