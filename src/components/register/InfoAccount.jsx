import { useState } from "react";
import "../../sass/InfoAccountAndUser.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

const InfoAccount = () => {
  let navigate = useNavigate();
  let location = useLocation();

  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");

  let handleClickRegisterAccount = async () => {
    // Kiểm tra xem mật khẩu đã nhập đầy đủ không
  if (password === '' || verifyPassword === '') {
    toast.error("Vui lòng nhập đầy đủ mật khẩu.");
    return;
  }

  // Kiểm tra xem mật khẩu có ít nhất 8 ký tự
  if (password.length < 8) {
    toast.error("Mật khẩu phải có ít nhất 8 ký tự.");
    return;
  }

  // Kiểm tra xem mật khẩu có chứa chữ thường, chữ hoa, số và ký tự đặc biệt
  let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
  if (!passwordRegex.test(password)) {
    toast.error("Mật khẩu phải chứa ít nhất một chữ thường, một chữ hoa, một số và một ký tự đặc biệt.");
    return;
  }

  // Kiểm tra xem mật khẩu và xác nhận mật khẩu có trùng khớp không
  if (password !== verifyPassword) {
    toast.error("Mật khẩu không trùng khớp");
    return;
  }

  // Tiếp tục với xử lý đăng ký tài khoản nếu mật khẩu đáp ứng các yêu cầu
  navigate("/register-form-Info-User", {
    state: {
      phone: location.state.phone,
      password: password,
      urlBackend : location.state.urlBackend
    },
  });
  };

  return (
    <div className="container-login">
      <Toaster toastOptions={{ duration: 4000 }} />
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