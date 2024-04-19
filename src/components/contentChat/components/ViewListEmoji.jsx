import { useState, useEffect} from "react";

/*Components*/
import {
  Button,
  Form,
  Row,
  Col,
  Select,
  message,
  Modal
} from "antd";
import axios from "axios";
import {  EditOutlined } from "@ant-design/icons";
import FormUpdateName from "./formUpdateName";
import { CiTrash } from "react-icons/ci";
import { MdOutlineBlock } from "react-icons/md";
import moment from "moment";

function ViewListEmoji({visible, setVisible, userId, urlBackend, emojis, quantity}) {
    const [form] = Form.useForm();
    const [visibleModal, setVisibleModal] = useState(false);
    const [user, setUser] = useState({});
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
    useEffect(() => {
        setVisibleModal(visible);
      }, [visible]);
    
    useEffect(() => {
    let getApiUserById = async () => {
      let datas = await axios.get(`${urlBackend}/users/${userId}`);
      setUser(datas.data);
    };
    getApiUserById();
    }, [userId]);

    const handleCancel = () => {
        form.resetFields();
        setVisibleModal(false);
    if (typeof setVisible === "function") {
      setVisible(false);
    }
    }
    let handleClick = (icon, quantity, index) => {
        setSelectedIcon(icon);
        setQuantityIcon(quantity);
        setIndexClick(index);
    }
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
                        <Col lg={6} xs={6} style={{backgroundColor: "#e7ebf1"}}>
                            <Row style={{cursor: "pointer", backgroundColor: indexClick===null? "#d6dbe1":"", paddingLeft:"10px"}} onClick={()=> handleClick(null,null,null)}>
                                <Col lg={20}>Tất cả</Col>
                                <Col>{quantity}</Col>
                            </Row>
                            {emojis.map((e,index)=>{
                                const emoji = listEmoji.find((ej) => ej.type === e);
                                return (
                                    <Row key={index} style={{cursor: "pointer", backgroundColor: index===indexClick? "#d6dbe1":"", paddingLeft:"10px"}} onClick={()=>handleClick(emoji.icon,emoji.icon.length,index)}>
                                        <Col lg={20}>{emoji.icon}</Col>
                                        <Col>{emoji.icon.length}</Col>
                                    </Row>
                                );
                            })}
                        </Col> 
                        <Col lg={18} xs={18}>
                            <div style={{display: 'flex', alignItems: "center", justifyContent: "space-around"}}>
                                <div style={{display: 'flex', alignItems: "center", }}>
                                    <img src={user?.image=="null" ?"/public/avatardefault.png":user?.image} style={{width : "30px", height : "30px", borderRadius:"50%"}} alt="Ảnh đại diện"/>
                                    <b style={{marginLeft : "10px"}}>{user?.name}</b>
                                </div>
                                    {selectedIcon!==null?
                                    <div style={{width:"120px"}}>
                                        <span>{selectedIcon}</span>
                                        <span style={{marginLeft:"10px"}}>{quantityIcon}</span>
                                    </div>   : (   
                                        <div style={{width:"120px",}}>{
                                            emojis.map((e,index)=>{
                                        
                                        const emoji = listEmoji.find((ej) => ej.type === e);
                                        return (
                                                <span key={index}>{emoji.icon}</span>
                                        );
                                    })}
                                    <span style={{marginLeft:"10px"}}>{quantity}</span>
                                </div>
                                ) 
                                }
                               
                                    
                            </div>                            
                        </Col>
                    </Row> 
                </Form>
            </Modal>
        </div>
     );
}

export default ViewListEmoji;