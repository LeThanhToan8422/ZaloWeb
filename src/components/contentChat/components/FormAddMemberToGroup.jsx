import { useState, useEffect } from "react";
import { Modal, Button, Form, Input, Checkbox, Avatar } from "antd";
import axios from "axios";
import { io } from "socket.io-client";


const FormAddMemberToGroup = ({
  userId,
  visible,
  setVisible,
  groupId,
  group,
  setGroup,
  urlBackend
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [form] = Form.useForm();
  const [selectedFriendsTemp, setSelectedFriendsTemp] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const [regexUrl] = useState(
    "https://s3-dynamodb-cloudfront-20040331.s3.ap-southeast-1.amazonaws.com/"
  );
  const [groupName, setGroupName] = useState("");
  const [visibleModal, setVisibleModal] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setVisibleModal(visible);
  }, [visible]);

  useEffect(() => {
    let newSocket = io(`${urlBackend}`);
    setSocket(newSocket);

    return () => {
      newSocket?.disconnect();
    };
  }, [userId]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(
          `${urlBackend}/users/get-friends-not-join-group/${userId}/${groupId.id}`
        );
        setFriendList(response.data);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };
    fetchFriends();
  }, [userId, JSON.stringify(group)]);

  const handleCancel = () => {
    setSelectedFriendsTemp([]);
    form.resetFields();
    setVisibleModal(false);
    if (typeof setVisible === "function") {
      setVisible(false);
    }
  };

  const handleFriendChange = (checkedValues) => {
    setSelectedFriendsTemp(checkedValues);
  };


  const handleSearchChange = async (e) => {
    setSearchTerm(e.target.value);
    let datas = [];
    if (e.target.value) {
      datas = await axios.get(
        `${urlBackend}/users/get-friends-not-join-group/${userId}/${groupId.id}/${e.target.value}`
      );
    } else {
      datas = await axios.get(
        `${urlBackend}/users/get-friends-not-join-group/${userId}/${groupId.id}`
      );
    }
    setFriendList([...datas.data])
  };

  const sendMessage = () => {
    socket.emit(`Client-Update-Group-Chats`, {
      group : group,
      mbs : selectedFriendsTemp,
      implementer : userId
    });
    group.members = [...group.members, ...selectedFriendsTemp]
    setGroup(group)
    setVisible(false)
  };


  return (
    <Modal
      title="Thêm thành viên"
      open={visibleModal}
      onOk={() => handleCancel()}
      onCancel={() => handleCancel()}
      footer={[
        <Button key="back" onClick={() => handleCancel()}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={sendMessage}
          disabled={!selectedFriendsTemp.length}
        >
          Xác nhận
        </Button>,
      ]}
    >
      <Form layout="vertical" form={form}>        
        <Form.Item>
          <Input
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Nhập tên"
          />
        </Form.Item>
        <Form.Item label="Bạn bè">
          <Checkbox.Group
            onChange={handleFriendChange}
            value={selectedFriendsTemp}
            style={{ width: "100%", display: "flex", flexDirection: "column" }}
          >
            {friendList?.map((friend) => (
              <div
                key={friend.id}
                style={{
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Checkbox value={friend.id} style={{ marginRight: "8px" }}>
                  <Avatar src={friend.image} style={{ marginRight: "8px" }} />
                  {friend.name}
                </Checkbox>
              </div>
            ))}
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormAddMemberToGroup;
