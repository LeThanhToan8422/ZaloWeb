import { useState, useEffect } from "react";
import { Modal, Button, Form, Input, Checkbox, Avatar } from "antd";
import axios from "axios";

const FormCreateGroup = ({
  userId,
  visible,
  setVisible,
  setRerender,
  urlBackend
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [form] = Form.useForm();
  const [selectedFriendsTemp, setSelectedFriendsTemp] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const [regexUrl] = useState(
    "https://s3-dynamodb-cloudfront-20040331.s3.ap-southeast-1.amazonaws.com/"
  );
  const [showFormCreateGroup, setShowFormCreateGroup] = useState(visible);
  const [groupName, setGroupName] = useState("");
  const [visibleModal, setVisibleModal] = useState(false);

  useEffect(() => {
    setVisibleModal(visible);
  }, [visible]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(
          `${urlBackend}/users/friends/${userId}`
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
    //       dateTimeSend : moment()
    //       .utcOffset(7)
    //       .format("YYYY-MM-DD HH:mm:ss"),
    //       sender: userId,
    //       receiver: selectedFriendsTemp[index],
    //       chatRoom: userId > selectedFriendsTemp[index] ? `${selectedFriendsTemp[index]}${userId}` : `${userId}${selectedFriendsTemp[index]}`,
    //     });
    //   }
    //   onCancel()
    //   setRerender(pre => !pre)
    // }
  };


  return (
    <Modal
      title="Tạo nhóm"
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
          disabled={!selectedFriendsTemp.length || !groupName.length>0}
        >
          Tạo nhóm
        </Button>,
      ]}
    >
      <Form layout="vertical" form={form}>
        <Form.Item>
          <Input
            value={groupName}
            placeholder="Nhập tên nhóm"   
            onChange={(e)=> setGroupName(e.target.value)}         
          />
        </Form.Item>
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
      </Form>
    </Modal>
  );
};

export default FormCreateGroup;
