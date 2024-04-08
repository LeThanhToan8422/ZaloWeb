import { useState, useEffect } from "react";
import { Modal, Button, Form, Input, Checkbox, Avatar } from "antd";
import axios from "axios";
import { io } from "socket.io-client";

const FormCard = ({
  userId,
  visible,
  setVisible,
  urlBackend
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFriendsTemp, setSelectedFriendsTemp] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [editable, setEditable] = useState(false);
  const [friendList, setFriendList] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [regexUrl] = useState(
    "https://s3-dynamodb-cloudfront-20040331.s3.ap-southeast-1.amazonaws.com/"
  );
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    let newSocket = io(`${urlBackend}`);
    setSocket(newSocket);
  }, [userId, JSON.stringify(selectedFriendsTemp)]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(
          `${urlBackend}/users/friends/${userId}`
        );
        setFriendList(response.data);
        setFilteredFriends(response.data);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };
    fetchFriends();
  }, [userId]);

  const handleCancel = () => {
    setSelectedFriendsTemp([]);
    setSelectedFriends([]);
    setEditable(false);
  };

  const handleFriendChange = (checkedValues) => {
    setSelectedFriendsTemp(checkedValues);
  };


  const handleSearchChange = async (e) => {
    setSearchTerm(e.target.value);
    let datas = [];
    if (e.target.value) {
      datas = await axios.get(
        `${urlBackend}/users/friends/${userId}/${e.target.value}`
      );
    } else {
      datas = await axios.get(
        `${urlBackend}/users/friends/${userId}`
      );
    }
    setFriendList([...datas.data])
  };

  const sendMessage = () => {
    // if (sharedContent) {
    //   for (let index = 0; index < selectedFriendsTemp.length; index++) {
    //     socket.emit(`Client-Chat-Room`, {
    //       message: sharedContent,
    //       sender: userId,
    //       receiver: selectedFriendsTemp[index],
    //       chatRoom: userId > selectedFriendsTemp[index] ? `${selectedFriendsTemp[index]}${userId}` : `${userId}${selectedFriendsTemp[index]}`,
    //     });
    //   }
    // }
  };

  return (
    <Modal
      title="Gửi danh thiếp"
      visible={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={sendMessage}
          disabled={!selectedFriendsTemp.length}
        >
          Gửi danh thiếp
        </Button>,
      ]}
    >
      <Form layout="vertical">
        <Form.Item label="Tìm kiếm">
          <Input
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Tìm danh thiếp theo tên"
          />
        </Form.Item>
        <Form.Item label="Bạn bè">
          <Checkbox.Group
            onChange={handleFriendChange}
            value={selectedFriendsTemp}
            style={{ width: "100%", display: "flex", flexDirection: "column" }}
          >
            {friendList.map((friend) => (
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

export default FormCard;
