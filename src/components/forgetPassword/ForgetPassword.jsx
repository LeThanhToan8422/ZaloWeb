import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";

import OtpInput from "otp-input-react";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "../../sass/register.css";
import { auth } from "../config/firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";

const ForgetPassword = () => {
  let navigate = useNavigate();
  let location = useLocation();

  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);

  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onForgetPassword();
          },
          "expired-callback": () => {},
        }
      );
    }
  }

  let onForgetPassword = async () => {
    let datas = await axios.get(
      `${location.state.urlBackend}/accounts/phone/0${ph.slice(2, 11)}`
    );
    if (datas.data) {
      setLoading(true);
      onCaptchVerify();

      const appVerifier = window.recaptchaVerifier;

      const formatPh = "+" + ph;

      signInWithPhoneNumber(auth, formatPh, appVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
          setLoading(false);
          setShowOTP(true);
          toast.success("Gửi OTP thành công!");
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    } else {
      toast.error("Tài khoản không tồn tại!!!");
    }
  };

  function onOTPVerify() {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        console.log(res);
        setUser(res.user);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  return (
    <section className="bg-emerald-500 flex items-center justify-center h-screen container-register">
      <div>
        <Toaster toastOptions={{ duration: 4000 }} />
        <div id="recaptcha-container"></div>
        {user ? (
          navigate("/forget-password-change", {
            state: {
              phone: `0${ph.slice(2, 11)}`,
              urlBackend : location.state.urlBackend
            },
          })
        ) : (
          <div className="w-80 flex flex-col items-center justify-center gap-4 rounded-lg p-4">
            <span className="title">Zalo</span>
            <span className="content">
              Khôi phục mật khẩu Zalo <br />
              để kết nối với ứng dụng Zalo Web
            </span>
            {showOTP ? (
              <div className="content-otp-register">
                <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full">
                  <BsFillShieldLockFill
                    size={30}
                    color="#0190F3"
                    className="icon-lock-register"
                  />
                </div>
                <label
                  htmlFor="otp"
                  className="font-bold text-xl text-black text-center"
                >
                  Nhập mã OTP
                </label>
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  OTPLength={6}
                  otpType="number"
                  disabled={false}
                  autoFocus
                  className="opt-container"
                  inputStyles={{
                    border: "1px solid black",
                  }}
                ></OtpInput>
                <button
                  onClick={onOTPVerify}
                  className="bg-emerald-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
                  style={{
                    backgroundColor: "#0190F3",
                  }}
                >
                  {loading && (
                    <CgSpinner size={20} className="mt-1 animate-spin" />
                  )}
                  <span>Xác thực OTP</span>
                </button>
              </div>
            ) : (
              <div className="content-form-number">
                <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full">
                  <BsTelephoneFill
                    size={30}
                    color="#0190F3"
                    className="icon-phone-register"
                  />
                </div>
                <label
                  htmlFor=""
                  className="font-bold text-xl text-black text-center"
                >
                  Nhập số điện thoại của bạn
                </label>
                <PhoneInput country={"vn"} value={ph} onChange={setPh} />
                <button
                  onClick={onForgetPassword}
                  className="bg-emerald-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
                  style={{
                    backgroundColor: "#0190F3",
                  }}
                >
                  {loading && (
                    <CgSpinner size={20} className="mt-1 animate-spin" />
                  )}
                  <span>Gửi mã OTP</span>
                </button>
                <button className="button-back" onClick={() => navigate(-1)}>
                  Quay lại
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ForgetPassword;
