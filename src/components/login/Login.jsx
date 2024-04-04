import { useEffect, useState } from "react";
import "../../sass/Login.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode";
import { io } from "socket.io-client";
import bcrypt from "bcryptjs";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
  let navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginByPhone, setIsLoginByPhone] = useState(true);
  const [src, setSrc] = useState("");

  useEffect(() => {
    QRCode.toDataURL("Đăng nhập QRCode")
      .then((url) => {
        setSrc(url);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const [socket, setSocket] = useState(null);
  useEffect(() => {
    let newSocket = io("http://localhost:8080");
    // newSocket.emit(`Client-Register-QR-Code`, {
    //   id: 1,
    // })
    setSocket(newSocket);
  }, [isLoginByPhone]);

  useEffect(() => {
    if (!isLoginByPhone) {
      console.log("Hello");
      socket?.on(`Server-Register-QR-Code`, (dataGot) => {
        navigate("/home", {
          state: {
            userId: dataGot.data.id,
          },
        });
      });
    } // mỗi khi có tin nhắn thì mess sẽ được render thêm

    return () => {
      socket?.disconnect();
    };
  }, [isLoginByPhone]);

  let handleClickLogin = async () => {
    let datas = await axios.get(
      `http://localhost:8080/accounts/phone/${phone}`
    );
    if (datas.data.user > 0) {
      if (bcrypt.compareSync(password, datas.data.password)) {
        navigate("/home", {
          state: {
            userId: datas.data.user,
            rerender : ""
          },
        });
        toast.success("Đăng nhập thành công!!!");
      }
      else{
        toast.error("Mật khẩu không chính xác!!!");
      }
    }
    else{
      toast.error("Thông tin không chính xác!!!");
    }
  };

  return (
    <div className="container-login">
      <Toaster toastOptions={{ duration: 4000 }} />
      <div className="form-login">
        <span className="title">Zalo</span>
        <span className="content">
          Đăng nhập tài khoản Zalo <br />
          để kết nối với ứng dụng Zalo Web
        </span>
        <div className="form">
          <div className="choose-login">
            <span
              onClick={() => setIsLoginByPhone(false)}
              style={{ color: !isLoginByPhone ? "#056BFF" : "" }}
            >
              VỚI MÃ QR
            </span>
            <span
              onClick={() => setIsLoginByPhone(true)}
              style={{ color: isLoginByPhone ? "#056BFF" : "" }}
            >
              VỚI SỐ ĐIỆN THOẠI
            </span>
          </div>
          {isLoginByPhone ? (
            <div className="login-by-phone">
              <div className="form-content">
                <i className="fa-solid fa-mobile-screen-button icon"></i>
                <select name="phone" id="" className="select-national">
                  <option value={84}>+84</option>
                </select>
                <input
                  value={phone}
                  type="text"
                  className="input-phone"
                  placeholder="Số điện thoại"
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="form-content">
                <i className="fa-solid fa-lock icon"></i>
                <input
                  value={password}
                  type="password"
                  className="input-password"
                  placeholder="Mật khẩu"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button className="button-login" onClick={handleClickLogin}>
                Đăng nhập với mật khẩu
              </button>
              <button
                className="button-register"
                onClick={() => navigate("/register")}
              >
                Tạo tài khoản
              </button>
              <span
                onClick={() => navigate("/forget-password")}
                className="forget-password"
              >
                Quên mật khẩu?
              </span>
            </div>
          ) : (
            <div className="login-by-qrcode">
              <div className="qrcode">
                <img
                  src={src}
                  alt=""
                  style={{
                    width: "250px",
                    height: "250px",
                  }}
                />
              </div>
              <span>Sử dụng ứng dụng Zalo để quét mã QR</span>
            </div>
          )}
        </div>
      </div>
      <div className="language"></div>
    </div>
  );
};

export default Login;
