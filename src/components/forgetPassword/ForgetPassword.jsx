import React, { useState } from "react";
import "../../sass/ForgetPassword.scss";
import "../../sass/Login.scss";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import OtpInput from "react-otp-input";
import { useNavigate } from "react-router-dom";

export default function ForgetPassword() {
  var history = useNavigate();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [isCheckPhone, setIsCheckPhone] = useState(false);

  const [isVertifi, setIsVertifi] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [country, setCountry] = useState("");
  const handleGetOTP = (phone) => {
    console.log(phone);
    setIsLoading(true);
    setIsVertifi(false);

    setTimeout(() => {
      setIsLoading(false);
      setIsVertifi(true);
    }, 1000);
  };
  return (
    <div className="container-login">
      <div className="form-forget">
        <span className="title_Zalo">Zalo</span>
        <span className="content">
          Đăng nhập tài khoản Zalo <br />
          để kết nối với ứng dụng Zalo Web
        </span>
        <div className="form">
          <p className="title">Nhập số điện thoại của bạn</p>
          <div className="form-content">
            <div className="container_icon">
              <i className="fa-solid fa-mobile-screen-button icon"></i>
            </div>
            <div style={{ width: "100%" }}>
              <PhoneInput
                inputStyle={{
                  height: "40px",
                  width: "100%",
                  borderWidth: "0px",
                  borderBottomWidth: "1px",
                  borderRadius: "0px",
                }}
                buttonStyle={{
                  borderWidth: "0px",
                  borderBottomWidth: "1px",
                  backgroundColor: "white",
                }}
                country={"vn"}
                value={phone}
                onChange={(e, country) => {
                  setCountry(country.dialCode);
                  setPhone(e);
                }}
              />
            </div>
          </div>
          <div className="check">
            {isCheckPhone && <span>Vui lòng nhập số điện thoại</span>}
          </div>

          {isLoading && <div className="loading"></div>}
          {isVertifi && (
            <div className="OTP">
              <span className="title_otp">Nhập mã OTP:</span>
              <div>
                <OtpInput
                  containerStyle={{ margin: "0px 5px" }}
                  inputStyle={{
                    height: "22px",
                    margin: "0px 3px",
                  }}
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  renderSeparator={<span> - </span>}
                  renderInput={(props) => <input {...props} />}
                />
              </div>
            </div>
          )}
          <button
            className="button-Submit"
            onClick={() => {
              if (phone.trim() !== country.trim()) {
                handleGetOTP(phone);
              }
            }}
          >
            Tiếp tục
          </button>
          <button
            className="button-back"
            onClick={() => {
              history(-1)
            }}
          >
            Quay lại
          </button>
        </div>
      </div>
      <div className="language">
        <span>Tiếng Việt</span>
        <span>English</span>
      </div>
    </div>
  );
}
