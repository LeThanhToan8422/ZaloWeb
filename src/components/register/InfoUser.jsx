import { useState } from "react";
import "../../sass/Login.scss";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const InfoUser = () => {
  let navigate = useNavigate();
  let location = useLocation();

  const [name, setname] = useState("");
  const [gender, setGender] = useState(true);
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const currentDate = new Date().toISOString().split("T")[0];

  let handleClickRegisterUser = async () => {
    let checkEmail = await axios.get(
      `http://localhost:8080/users/email/${email}`
    );
    if (!checkEmail.data) {
      let dataUsers = await axios.post(`http://localhost:8080/users`, {
        name: name,
        gender: gender,
        dob: dob,
        email: email,
      });
      if (dataUsers.data !== null) {
        let dataAccounts = await axios.post(`http://localhost:8080/accounts`, {
          phone: location.state.phone,
          password: location.state.password,
          user: dataUsers.data.id,
        });
        if (dataAccounts.data) {
          navigate("/");
          toast.success("Đăng ký thành công!");
        }
      }
    } else {
      toast.error("Email đã tồn tại!!!");
    }
  };

  return (
    <div className="container-login">
      <Toaster toastOptions={{ duration: 4000 }} />
      <div className="form-register" style={{ height: "80%" }}>
        <span className="title">Zalo</span>
        <span className="content">
          Đăng ký tài khoản Zalo <br />
          để kết nối với bạn bè
        </span>
        <div className="form-register-user">
          <div className="register-infor-user">
            <div className="form-content">
              <i className="fa-solid fa-signature icon"></i>
              <input
                type="text"
                className="input-name input"
                placeholder="Tên..."
                onChange={(e) => setname(e.target.value)}
              />
            </div>
            <div className="form-content">
              <i className="fa-solid fa-venus-mars icon"></i>
              <div className="content-gender">
                <input
                  type="radio"
                  className="input-gender input"
                  id="male"
                  name="gender"
                  placeholder=""
                  checked
                  onChange={() => setGender(true)}
                />
                <label htmlFor="male">Nam</label>
              </div>
              <div className="content-gender">
                <input
                  type="radio"
                  className="input-gender input"
                  id="female"
                  name="gender"
                  placeholder=""
                  onChange={() => setGender(false)}
                />
                <label htmlFor="female">Nữ</label>
              </div>
            </div>
            <div className="form-content">
              <i className="fa-solid fa-calendar-days icon"></i>
              <input
                type="date"
                className="input-dob input"
                placeholder="Chọn ngày sinh"
                max={currentDate}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
            <div className="form-content">
              <i className="fa-regular fa-envelope icon"></i>
              <input
                type="email"
                className="input-email input"
                placeholder="Email..."
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              className="button-register"
              onClick={handleClickRegisterUser}
            >
              Đăng ký
            </button>
            <button className="button-back" onClick={() => navigate(-1)}>
              Quay lại
            </button>
          </div>
        </div>
      </div>
      <div className="language"></div>
    </div>
  );
};

export default InfoUser;
