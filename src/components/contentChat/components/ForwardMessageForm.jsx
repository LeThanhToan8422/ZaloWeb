import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, Checkbox, Avatar } from 'antd';
import axios from 'axios';

const ForwardMessageForm = ({
  visible,
  onCancel,
  sharedContentFromInfoMess,
  userId,
  onForwardMessageContent,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFriendsTemp, setSelectedFriendsTemp] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [sharedContent, setSharedContent] = useState('');
  const [editable, setEditable] = useState(false);
  const [friendList, setFriendList] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);

 
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/users/friends/4`
        );
        setFriendList(response.data);
        setFilteredFriends(response.data);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };
    fetchFriends();
  }, [userId]);

  useEffect(() => {
    if (sharedContentFromInfoMess && sharedContentFromInfoMess.content) {
      setSharedContent(sharedContentFromInfoMess.content);
    }
  }, [sharedContentFromInfoMess]);

  const handleCancel = () => {
    setSelectedFriendsTemp([]);
    setSelectedFriends([]);
    setSharedContent('');
    setEditable(false);
    onCancel();
  };

  const handleFriendChange = (checkedValues) => {
    setSelectedFriendsTemp(checkedValues);
  };

  const handleForwardMessage = () => {
    setSelectedFriends(selectedFriendsTemp);
    onForwardMessageContent(sharedContent, selectedFriendsTemp);
    handleCancel();
  };

  const handleEditClick = () => {
    setEditable(true);
  };

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    const filtered = friendList.filter((friend) =>
      friend.name.toLowerCase().includes(searchTerm)
    );
    setFilteredFriends(filtered);
  };

  const sendMessage = () => {
    if (message !== null) {
      socket.emit(`Client-Chat-Room`, {
        message: message,
        sender: userId,
        receiver: idChat,
        chatRoom: userId > idChat ? `${idChat}${userId}` : `${userId}${idChat}`,
      });

      setMessage("");
      setDisplayIcons(false);
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
          disabled={!selectedFriendsTemp.length || !sharedContent.trim()}>
          Chia sẻ
        </Button>,
      ]}>
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
            style={{ width: '100%' }}>
            {Array(Math.ceil(filteredFriends.length / 3))
              .fill()
              .map((_, index) => (
                <div key={index}>
                  {[0, 1, 2].map((offset) => {
                    const friendIndex = index * 3 + offset;
                    const friend = filteredFriends[friendIndex];
                    if (!friend) return null; 
                    return (
                      <div
                        key={friend.id}
                        style={{
                          marginBottom: '8px',
                          display: 'flex',
                          alignItems: 'center',
                        }}>
                        <Checkbox
                          value={friend.id}
                          style={{ marginRight: '8px' }}>
                          <Avatar
                            src={friend.avatar}
                            style={{ marginRight: '8px' }}
                          />
                          {friend.name}
                        </Checkbox>
                      </div>
                    );
                  })}
                </div>
              ))}
          </Checkbox.Group>
        </Form.Item>

        <Form.Item label="Nội dung chia sẻ">
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Input
              value={sharedContent}
              onChange={(e) => setSharedContent(e.target.value)}
              placeholder="Nhập nội dung chia sẻ"
              style={{ flex: '1', marginRight: '5px' }}
              disabled={!editable}
            />
            <Button
              style={{ width: '80px' }}
              onClick={handleEditClick}
              disabled={editable}>
              Sửa
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ForwardMessageForm;
