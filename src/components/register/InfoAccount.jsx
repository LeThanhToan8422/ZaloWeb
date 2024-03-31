import { useState } from "react";
import "../../sass/InfoAccountAndUser.scss";
import { useLocation, useNavigate } from "react-router-dom";

const InfoAccount = () => {
  let navigate = useNavigate();
  let location = useLocation();

  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");

  let handleClickRegisterAccount = async () => {
    if (verifyPassword === password) {
      navigate("/register-form-Info-User", {
        state: {
          phone: location.state.phone,
          password: password,
        },
      });
    }
  };

  return (
    <div className="container-login">
      <div className="form-register">
        <span className="title">Zalo</span>
        <span className="content">
          Đăng ký tài khoản Zalo <br />
          để kết nối với bạn bè
        </span>
        <div className="form-register-account">
          <div className="register-by-phone">
            <div className="form-content">
              <i className="fa-solid fa-lock icon"></i>
              <input
                type="password"
                className="input"
                placeholder="Mật khẩu"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-content">
              <i className="fa-solid fa-lock icon"></i>
              <input
                type="password"
                className="input"
                placeholder="Xác nhận mật khẩu"
                onChange={(e) => setVerifyPassword(e.target.value)}
              />
            </div>
            <button
              className="button-register"
              onClick={handleClickRegisterAccount}
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

export default InfoAccount;