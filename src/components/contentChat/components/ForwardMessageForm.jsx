import { useState, useEffect } from "react";
import { Modal, Button, Form, Input, Checkbox, Avatar } from "antd";
import axios from "axios";
import ViewFile from "./ViewFile";
import { io } from "socket.io-client";

const ForwardMessageForm = ({
  userId,
  visible,
  onCancel,
  sharedContentFromInfoMess,
  setRerender
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFriendsTemp, setSelectedFriendsTemp] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [sharedContent, setSharedContent] = useState(sharedContentFromInfoMess);
  const [editable, setEditable] = useState(false);
  const [friendList, setFriendList] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [regexUrl] = useState(
    "https://s3-dynamodb-cloudfront-20040331.s3.ap-southeast-1.amazonaws.com/"
  );
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    let newSocket = io("https://zalo-backend-team-6.onrender.com");
    setSocket(newSocket);
  }, [userId, sharedContentFromInfoMess, JSON.stringify(selectedFriendsTemp)]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(
          `https://zalo-backend-team-6.onrender.com/users/friends/${userId}`
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
    setSharedContent("");
    setEditable(false);
    onCancel();
  };

  const handleFriendChange = (checkedValues) => {
    setSelectedFriendsTemp(checkedValues);
  };

  const handleEditClick = () => {
    setEditable(true);
  };

  const handleSearchChange = async (e) => {
    setSearchTerm(e.target.value);
    let datas = [];
    if (e.target.value) {
      datas = await axios.get(
        `https://zalo-backend-team-6.onrender.com/users/friends/${userId}/${e.target.value}`
      );
    } else {
      datas = await axios.get(
        `https://zalo-backend-team-6.onrender.com/users/friends/${userId}`
      );
    }
    setFriendList([...datas.data])
  };

  const sendMessage = () => {
    if (sharedContent) {
      for (let index = 0; index < selectedFriendsTemp.length; index++) {
        socket.emit(`Client-Chat-Room`, {
          message: sharedContent,
          sender: userId,
          receiver: selectedFriendsTemp[index],
          chatRoom: userId > selectedFriendsTemp[index] ? `${selectedFriendsTemp[index]}${userId}` : `${userId}${selectedFriendsTemp[index]}`,
        });
      }
      onCancel()
      setRerender(pre => !pre)
    }
  };

  return (
    <Modal
      title="Chia sẻ"
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
          disabled={!selectedFriendsTemp.length || !sharedContent.trim()}
        >
          Chia sẻ
        </Button>,
      ]}
    >
      <Form layout="vertical">
        <Form.Item label="Tìm kiếm">
          <Input
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Tìm kiếm bạn bè"
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

        <Form.Item label="Nội dung chia sẻ">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {sharedContentFromInfoMess.includes(regexUrl) ? (
              <ViewFile url={sharedContentFromInfoMess} />
            ) : (
              <>
                <Input
                  value={sharedContent}
                  onChange={(e) => setSharedContent(e.target.value)}
                  placeholder="Nhập nội dung chia sẻ"
                  style={{ flex: "1", marginRight: "5px" }}
                  disabled={!editable}
                />
                <Button
                  style={{ width: "80px" }}
                  onClick={handleEditClick}
                  disabled={editable}
                >
                  Sửa
                </Button>
              </>
            )}
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ForwardMessageForm;
