// import { useState } from "react";
// import "../../../sass/InfoAccountAndUser.scss";
// import { useLocation, useNavigate } from "react-router-dom";
// import { toast, Toaster } from "react-hot-toast";
// import axios from "axios";
// import bcrypt from "bcryptjs";

// const FormUpdatePassword = () => {
//   let navigate = useNavigate();
//   let location = useLocation();
//   let salt = bcrypt.genSaltSync(10);

//   const [oldPassword, setOldPassword] = useState("");
//   const [password, setPassword] = useState("");
//   const [verifyPassword, setVerifyPassword] = useState("");

//   let handleClickUpdatePassword = async () => {
//     // Kiểm tra xem mật khẩu đã nhập đầy đủ không
//     if (password === "" || verifyPassword === "") {
//       toast.error("Vui lòng nhập đầy đủ mật khẩu.");
//       return;
//     }

//     // Kiểm tra xem mật khẩu có ít nhất 8 ký tự
//     if (password.length < 8) {
//       toast.error("Mật khẩu phải có ít nhất 8 ký tự.");
//       return;
//     }

//     // Kiểm tra xem mật khẩu có chứa chữ thường, chữ hoa, số và ký tự đặc biệt
//     let passwordRegex =
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
//     if (!passwordRegex.test(password)) {
//       toast.error(
//         "Mật khẩu phải chứa ít nhất một chữ thường, một chữ hoa, một số và một ký tự đặc biệt."
//       );
//       return;
//     }

//     // Kiểm tra xem mật khẩu và xác nhận mật khẩu có trùng khớp không
//     if (password !== verifyPassword) {
//       toast.error("Mật khẩu không trùng khớp");
//       return;
//     }

//     let datas = await axios.get(
//       `http://localhost:8080/accounts/user/${location.state.userId}`
//     );
//     if (datas.data) {
//       if (bcrypt.compareSync(oldPassword, datas.data.password)) {
//         let hashPassword = bcrypt.hashSync(password, salt);
//         await axios.put(`http://localhost:8080/accounts`, {
//           id: datas.data.id,
//           phone: datas.data.phone,
//           password: hashPassword,
//         });
//         navigate("/");
//       }
//       else{
//         toast.error("Mật khẩu cũ không chính xác!!!")
//       }
//     }
//   };

//   return (
//     <div className="container-login">
//       <Toaster toastOptions={{ duration: 4000 }} />
//       <div className="form-register">
//         <span className="title">Zalo</span>
//         <span className="content">
//           Cập nhật mật khẩu Zalo <br />
//           để kết nối với bạn bè
//         </span>
//         <div className="form-register-account">
//           <div className="register-by-phone">
//             <div className="form-content">
//               <i className="fa-solid fa-lock icon"></i>
//               <input
//                 value={oldPassword}
//                 type="password"
//                 className="input"
//                 placeholder="Mật khẩu cũ"
//                 onChange={(e) => setOldPassword(e.target.value)}
//               />
//             </div>
//             <div className="form-content">
//               <i className="fa-solid fa-lock icon"></i>
//               <input
//                 value={password}
//                 type="password"
//                 className="input"
//                 placeholder="Mật khẩu mới"
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>
//             <div className="form-content">
//               <i className="fa-solid fa-lock icon"></i>
//               <input
//                 value={verifyPassword}
//                 type="password"
//                 className="input"
//                 placeholder="Xác nhận mật khẩu mới"
//                 onChange={(e) => setVerifyPassword(e.target.value)}
//               />
//             </div>
//             <button
//               className="button-register"
//               onClick={handleClickUpdatePassword}
//             >
//               Cập nhật
//             </button>
//             <button className="button-back" onClick={() => navigate(-1)}>
//               Quay lại
//             </button>
//           </div>
//         </div>
//       </div>
//       <div className="language"></div>
//     </div>
//   );
// };

// export default FormUpdatePassword;


import { useState, useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";

/*Components*/
import {
  Button,
  Form,
  Input,
  Row,
  Col,
  message,
  Modal,
} from "antd";
import axios from "axios";
import moment from "moment";

function FormChangePassword({visible, setVisible, userId}) {
  let salt = bcrypt.genSaltSync(10);
  let navigate = useNavigate();
  const [form] = Form.useForm();
  const [visibleModal, setVisibleModal] = useState(false);
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

  const validatePassword = (_, value) => {
    // Check for at least 8 characters, one uppercase, one lowercase, one digit, and one special character
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(value)) {
      return Promise.reject('Mật khẩu cần ít nhất 8 kí tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.');
    }
    return Promise.resolve();
  };

  // Custom validation function for matching passwords
  const validateConfirmPassword = (_, value) => {
    if (value !== form.getFieldValue('password')) {
      return Promise.reject('Mật khẩu không trùng khớp.');
    }
    return Promise.resolve();
  };

  const onFinish = async (values) => {
    try {
      let datas = await axios.get(
              `http://localhost:8080/accounts/user/${userId}`
            );
            if (datas.data) {
                    if (bcrypt.compareSync(values.oldPassword, datas.data.password)) {
                      let hashPassword = bcrypt.hashSync(values.password, salt);
                      await axios.put(`http://localhost:8080/accounts`, {
                        id: datas.data.id,
                        phone: datas.data.phone,
                        password: hashPassword,
                      });
                      navigate("/");
                    }
                    else{
                      message.error("Mật khẩu cũ không chính xác!!!")
                    }
                  }
    } catch (error) {
      console.log("Error: ", error);
      message.error(error.message);
    }
  }

    return ( 
    <Modal
        title="Đổi mật khẩu"
        open={visibleModal}
        onOk={() => handleCancel()}
        onCancel={() => handleCancel()}
        width="30%"
        footer={null}
        
    >
              <Form
                form={form}
                onFinish={onFinish}
                className="ant-advanced-search-form"
              >
                <Row gutter={15}>
                  <Col lg={10}><b>Mật khẩu cũ</b></Col>
                  <Col lg={14} xs={24}>
                    <Form.Item
                      name="oldPassword"
                      rules={[{ required: true, message: "Bạn chưa nhập mật khẩu cũ" }]}
                    >
                      <Input maxLength={100} type="password" addonAfter={<span style={{color: "red"}}>*</span>}/>
                    </Form.Item>
                  </Col>             
                </Row>
              
                <Row gutter={15}>
                  <Col lg={10}><b>Mật khẩu mới</b></Col>
                  <Col lg={14} xs={24}>
                    <Form.Item
                      required
                      name="password"
                      rules={[{ required: true, message: "Bạn chưa nhập mật khẩu mới" },
                      { validator: validatePassword }]}
                    >
                     <Input maxLength={100} type="password" addonAfter={<span style={{color: "red"}}>*</span>}/>               
                    </Form.Item>
                  </Col>                
                </Row>
                <Row gutter={15}>
                  <Col lg={10}><b>Xác nhận mật khẩu mới</b></Col>
                  <Col lg={14} xs={24}>
                    <Form.Item
                      rules={[{ required: true, message: "Bạn chưa nhập xác nhận mật khẩu mới" },
                      { validator: validateConfirmPassword }]}
                      name="verifyPassword"
                    >
                      <Input maxLength={100} type="password" addonAfter={<span style={{color: "red"}}>*</span>}/>
                    </Form.Item>
                  </Col>                
                </Row>
                <div>
                  <Button
                    className="btn-signin"
                    type="light"
                    size="large"
                    onClick={handleCancel}
                  >
                    Hủy
                  </Button>
                  <Button
                    className="btn-signin"
                    htmlType="submit"
                    type="primary"
                    size="large"
                  >
                    Cập nhật
                  </Button>
                </div>
              </Form>
        </Modal> );
}

export default FormChangePassword;