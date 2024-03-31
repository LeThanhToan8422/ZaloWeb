import { useState } from "react";
import "../../sass/InfoAccountAndUser.scss";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

const ChangePassword = () => {
  let navigate = useNavigate();
  let location = useLocation();

  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");

  let handleClickChangePassword = async () => {
    if (verifyPassword === password) {
        let datas = await axios.get(`http://localhost:8080/accounts/phone/${location.state.phone}`);
        console.log(datas.data);
        if(datas.data){
            let dataAccount = await axios.put(`http://localhost:8080/accounts`,{
                phone: location.state.phone,
                password: password,
                user: datas.data.user,
                id: datas.data.id,
            });
            console.log(dataAccount);
            if(dataAccount.data){
                toast.success("Cập nhật thành công");
                navigate("/");
            }
            else {
                toast.error("Cập nhật thất bại");
            }
        }
        
        
    //   navigate("/register-form-Info-User", {
    //     state: {
    //       phone: location.state.phone,
    //       password: password,
    //     },
    //   });
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