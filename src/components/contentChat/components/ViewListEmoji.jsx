import { useState, useEffect } from "react";

/*Components*/
import { Form, Row, Col, Modal } from "antd";
import axios from "axios";

function ViewListEmoji({
  visible,
  setVisible,
  urlBackend,
  quantity,
  chatSelectedDisplayEmojis,
}) {
  const [form] = Form.useForm();
  const [visibleModal, setVisibleModal] = useState(false);
  const [listEmoji] = useState([
    {
      type: "like",
      icon: "👍",
    },
    {
      type: "love",
      icon: "❤️",
    },
    {
      type: "haha",
      icon: "😂",
    },
    {
      type: "wow",
      icon: "😲",
    },
    {
      type: "sad",
      icon: "😭",
    },
    {
      type: "angry",
      icon: "😡",
    },
  ]);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [quantityIcon, setQuantityIcon] = useState();
  const [indexClick, setIndexClick] = useState(null);
  const [usersGiveremojis, setUsersGiverEmojis] = useState(null);
  const [emojisOfUsers, setEmojisOfUsers] = useState(null);
  const [iconEmojis, setIconEmojis] = useState(null);
  const [userIds, setUserIds] = useState(null);

  useEffect(() => {
    setVisibleModal(visible);
  }, [visible]);

  useEffect(() => {
    let getApiUsersGiverEmojis = async () => {
      let datas = await axios.get(
        `${urlBackend}/emotions/chat/${chatSelectedDisplayEmojis}`
      );
      // datas.data.reduce((total, o)  => total + o.quantities, 0)
      converDatas(datas.data);
      setUserIds([...new Set(datas.data.map((u) => u.id))]);
      setIconEmojis([...new Set(datas.data.map((dt) => dt.type))]);
      setUsersGiverEmojis(datas.data);
    };
    getApiUsersGiverEmojis();
  }, [chatSelectedDisplayEmojis]);

  let converDatas = (data) => {
    const resultMap = new Map();

    // Lặp qua mỗi phần tử trong mảng data và cập nhật thông tin vào resultMap
    data.forEach((item) => {
      const id = item.id;
      if (!resultMap.has(id)) {
        resultMap.set(id, {
          id: id,
          name: item.name,
          image: item.image,
          type: [],
          quantities: 0,
        });
      }
      const entry = resultMap.get(id);
      entry.type.push(item.type);
      entry.quantities += item.quantities;
    });

    // Chuyển từ Map thành mảng kết quả
    const result = Array.from(resultMap.values());

    setEmojisOfUsers([...result]);
  };

  const handleCancel = () => {
    form.resetFields();
    setVisibleModal(false);
    if (typeof setVisible === "function") {
      setVisible(false);
    }
  };
  let handleClick = (icon, quantity, index) => {
    setSelectedIcon(icon);
    setQuantityIcon(quantity);
    setIndexClick(index);
  };
  return (
    <div>
      <Modal
        title="Biểu cảm"
        visible={visibleModal}
        onOk={() => handleCancel()}
        onCancel={() => handleCancel()}
        width="30%"
        footer={null}
      >
        <Form
          form={form}
          name="form_info_account"
          className="ant-advanced-search-form"
        >
          <Row>
            <Col lg={6} xs={6} style={{ backgroundColor: "#e7ebf1" }}>
              <Row
                style={{
                  cursor: "pointer",
                  backgroundColor: indexClick === null ? "#d6dbe1" : "",
                  paddingLeft: "10px",
                }}
                onClick={() => handleClick(null, null, null)}
              >
                <Col lg={20}>Tất cả</Col>
                <Col>{quantity}</Col>
              </Row>
              {iconEmojis?.map((e, index) => {
                const emoji = listEmoji.find((ej) => ej.type === e);
                return (
                  <Row
                    key={index}
                    style={{
                      cursor: "pointer",
                      backgroundColor: index === indexClick ? "#d6dbe1" : "",
                      paddingLeft: "10px",
                    }}
                    onClick={() =>
                      handleClick(
                        emoji,
                        usersGiveremojis
                          ?.filter((u) => u.type === emoji.type)
                          .reduce((total, o) => total + o.quantities, 0),
                        index
                      )
                    }
                  >
                    <Col lg={20}>{emoji.icon}</Col>
                    <Col>
                      {usersGiveremojis
                        ?.filter((u) => u.type === emoji.type)
                        .reduce((total, o) => total + o.quantities, 0)}
                    </Col>
                  </Row>
                );
              })}
            </Col>
            <Col lg={18} xs={18}>
              {!selectedIcon
                ? emojisOfUsers?.map((user) => (
                    <>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-around",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <img
                            src={
                              user?.image == "null"
                                ? "/public/avatardefault.png"
                                : user?.image
                            }
                            style={{
                              width: "30px",
                              height: "30px",
                              borderRadius: "50%",
                            }}
                            alt="Ảnh đại diện"
                          />
                          <b style={{ marginLeft: "10px" }}>{user?.name}</b>
                        </div>
                        <div style={{ width: "120px" }}>
                          {user.type?.map((t, index) => {
                            return (
                              <span key={index}>
                                {listEmoji.find((e) => e.type === t).icon}
                              </span>
                            );
                          })}
                          <span style={{ marginLeft: "10px" }}>
                            {user.quantities}
                          </span>
                        </div>
                      </div>
                    </>
                  ))
                : usersGiveremojis
                    ?.filter((u) => u.type === selectedIcon.type)
                    ?.map((user) => (
                      <>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-around",
                          }}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <img
                              src={
                                user?.image == "null"
                                  ? "/public/avatardefault.png"
                                  : user?.image
                              }
                              style={{
                                width: "30px",
                                height: "30px",
                                borderRadius: "50%",
                              }}
                              alt="Ảnh đại diện"
                            />
                            <b style={{ marginLeft: "10px" }}>{user?.name}</b>
                          </div>
                          <div style={{ width: "120px" }}>
                            <span>{selectedIcon.icon}</span>
                            <span style={{ marginLeft: "10px" }}>
                              {user.quantities}
                            </span>
                          </div>
                        </div>
                      </>
                    ))}
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}

export default ViewListEmoji;
