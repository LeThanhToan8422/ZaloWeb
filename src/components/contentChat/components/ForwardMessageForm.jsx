import { useState, useEffect } from "react";
import { Modal, Button, Form, Input, Checkbox, Avatar } from "antd";
import axios from "axios";
import ViewFile from "./ViewFile";
import { io } from "socket.io-client";
import moment from "moment";

const ForwardMessageForm = ({
  userId,
  visible,
  onCancel,
  sharedContentFromInfoMess,
  setRerender,
  urlBackend
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFriendsTemp, setSelectedFriendsTemp] = useState([]);
  const [selectedIdFriends, setSelectedIdFriends] = useState([]);
  const [sharedContent, setSharedContent] = useState(sharedContentFromInfoMess);
  const [editable, setEditable] = useState(false);
  const [friendList, setFriendList] = useState([]);
  const [regexUrl] = useState(
    "https://s3-dynamodb-cloudfront-20040331.s3.ap-southeast-1.amazonaws.com/"
  );
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    let newSocket = io(`${urlBackend}`);
    setSocket(newSocket);
  }, [userId, sharedContentFromInfoMess, JSON.stringify(selectedFriendsTemp)]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(
          `${urlBackend}/users/get-chats-by-id/${userId}`
        );
        setFriendList(response.data);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };
    fetchFriends();
  }, [userId]);

  const handleCancel = () => {
    setSelectedFriendsTemp([]);
    setSharedContent("");
    setEditable(false);
    onCancel();
  };

  const handleFriendChange = (checkedValues) => {
    setSelectedIdFriends(checkedValues)
    setSelectedFriendsTemp(checkedValues.map(o => {
      if(o.leader){
        return {
          id : o.id,
          type : "Group"
        }
      }
      else{
        return {
          id : o.id,
          type : "Single"
        }
      }
    }));
  };

  const handleEditClick = () => {
    setEditable(true);
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
    if (sharedContent) {
      for (let index = 0; index < selectedFriendsTemp.length; index++) {
        socket.emit(`Client-Chat-Room`, {
          message: sharedContent,
          dateTimeSend : moment()
          .utcOffset(7)
          .format("YYYY-MM-DD HH:mm:ss"),
          sender: userId,
          receiver: selectedFriendsTemp[index].type === "Single" ? selectedFriendsTemp[index].id : null,
          groupChat: selectedFriendsTemp[index].type === "Group" ? selectedFriendsTemp[index].id : null,
          chatRoom: selectedFriendsTemp[index].type === "Single" ? userId > selectedFriendsTemp[index].id ? `${selectedFriendsTemp[index].id}${userId}` : `${userId}${selectedFriendsTemp[index].id}` : selectedFriendsTemp[index].id,
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
          disabled={!selectedFriendsTemp.length || !sharedContent?.trim()}
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
            value={selectedIdFriends}
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
                <Checkbox value={friend} style={{ marginRight: "8px" }}>
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
