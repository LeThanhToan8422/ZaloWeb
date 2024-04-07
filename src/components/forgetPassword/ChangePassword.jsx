import { useState } from "react";
import "../../sass/InfoAccountAndUser.scss";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import bcrypt from "bcryptjs";

const ChangePassword = () => {
  let salt = bcrypt.genSaltSync(10);
  let navigate = useNavigate();
  let location = useLocation();

  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");

  let handleClickChangePassword = async () => {
    if (password === "" || verifyPassword === "") {
      toast.error("Vui lòng nhập đầy đủ mật khẩu.");
      return;
    }

    // Kiểm tra xem mật khẩu có ít nhất 8 ký tự
    if (password.length < 8) {
      toast.error("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }

    // Kiểm tra xem mật khẩu có chứa chữ thường, chữ hoa, số và ký tự đặc biệt
    let passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "Mật khẩu phải chứa ít nhất một chữ thường, một chữ hoa, một số và một ký tự đặc biệt."
      );
      return;
    }

    // Kiểm tra xem mật khẩu và xác nhận mật khẩu có trùng khớp không
    if (password !== verifyPassword) {
      toast.error("Mật khẩu không trùng khớp");
      return;
    }
    if (verifyPassword === password) {
      let datas = await axios.get(
        `${location.state.urlBackend}/accounts/phone/${location.state.phone}`
      );
      if (datas.data) {
        let hashPassword = bcrypt.hashSync(password, salt);
        let dataAccount = await axios.put(`${location.state.urlBackend}/accounts`, {
          phone: location.state.phone,
          password: hashPassword,
          user: datas.data.user,
          id: datas.data.id,
        });
        if (dataAccount.data) {
          toast.success("Cập nhật thành công");
          navigate("/");
        } else {
          toast.error("Cập nhật thất bại");
        }
      }
    }
  };

  return (
    <div className="container-login">
      <Toaster toastOptions={{ duration: 4000 }} />
      <div className="form-register">
        <span className="title">Zalo</span>
        <span className="content">
          Đặt lại mật khẩu Zalo <br />
          để kết nối với ứng dụng Zalo Web
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
              onClick={handleClickChangePassword}
            >
              Xác nhận
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

export default ChangePassword;
