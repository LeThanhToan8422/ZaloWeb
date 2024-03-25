import React, { useState } from "react";
import auth from "../../firebase";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import "../../sass/ForgetPassword.scss";
import "../../sass/Login.scss";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import OtpInput from "react-otp-input";
import { useNavigate } from "react-router-dom";

export default function Register() {
  var history = useNavigate();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [isCheckPhone, setIsCheckPhone] = useState(false);

  const [isVertifi, setIsVertifi] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [country, setCountry] = useState("");

  const configureCaptcha = () =>{
    const auth = getAuth();
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'sign-in-button', {
  'size': 'invisible',
  'callback': (response) => {
    // reCAPTCHA solved, allow signInWithPhoneNumber.
    handleGetOTP(phone);
  }
});
  }

  const handleGetOTP = (phone) => {
    configureCaptcha();
    console.log(phone);
    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phone, appVerifier)
        .then((confirmationResult) => {
          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).
          window.confirmationResult = confirmationResult;
          console.log("OTP has been sent")
          // ...
        }).catch((error) => {
          // Error; SMS not sent
          // ...
          console.log("SMS not sent")
        });

    setIsLoading(true);
    setIsVertifi(false);

    setTimeout(() => {
      setIsLoading(false);
      setIsVertifi(true);
    }, 1000);

    history("/register-formInfoAccount")
  };
  return (
    <div className="container-login">
      <div className="form-forget">
        <span className="title_Zalo">Zalo</span>
        <span className="content">
          Đăng ký tài khoản Zalo <br />
          để kết nối với bạn bè
        </span>
        <div className="form">
          <p className="title">Nhập số điện thoại của bạn</p>
          <div className="form-content" id="sign-in-button">
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
              if (phone.trim().length>6) {
                let phoneNumber = `+${phone}`;
                handleGetOTP(phoneNumber);
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
      </div>
    </div>
  );
}
