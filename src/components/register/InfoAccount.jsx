import { useState } from 'react';
import '../../sass/Register.scss';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const InfoAccount = () => {
  let navigate = useNavigate();

  const [phone, setPhone] = useState('0329623380');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [date, setDate] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoginByPhone, setIsLoginByPhone] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const handleClickLogin = async () => {
    // Kiểm tra mật khẩu
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setErrorMessage(
        'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ viết thường, chữ viết hoa, số và ký tự đặc biệt.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu và xác nhận mật khẩu phải giống nhau.');
    } else {
      try {
        const datas = await axios.post('http://localhost:8080/login', {
          phone: phone,
          password: password,
        });

        if (datas.data.id > 0) {
          navigate('/home', {
            state: {
              userId: datas.data.id,
            },
          });
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        // Reset error message
        setErrorMessage('');
      }
    }
  };

  return (
    <div className="container-login">
      <div className="form-login" style={{ height: '90%', width: '60%' }}>
        <span className="title">Zalo</span>
        <span className="content" style={{ padding: 5 }}>
          Đăng ký tài khoản Zalo để<br />
          kết nối với bạn bè
        </span>
        <div className="form">
          <div className="choose-login">
            <span
              style={{ color: '#056BFF', fontSize: 23, fontWeight: 'bold' }}>
              ĐĂNG KÝ
            </span>
          </div>
          <div className="login-by-phone">
            <div className="form-content">
              <i className="fa-solid fa-lock icon"></i>
              <input
                style={{ marginLeft: 8 }}
                type="password"
                className="input-password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-content">
              <i className="fa-solid fa-lock icon"></i>
              <input
                style={{ marginLeft: 8 }}
                type="password"
                className="input-password"
                placeholder="Xác nhận mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {errorMessage && (
              <p
                style={{
                  color: 'red',
                  fontSize: '0.9rem',
                  marginBottom: '10px',
                  margin: 15,
                  paddingLeft: 15,
                }}>
                {errorMessage}
              </p>
            )}
            <h5 style={{ paddingTop: 10, fontSize: 22 }}>
              Thông tin tài khoản
            </h5>
            <div className="form-content">
              <input
                value={name}
                type="text"
                className="input-password"
                placeholder="Tên tài khoản"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-content-gender">
              <div style={{ marginRight: 15 }}>Giới tính</div>
              <div>
                <input
                  style={{ marginRight: 5 }}
                  type="radio"
                  name="gender"
                  onChange={(e) => setGender(e.target.value)}
                  id="male"
                  checked
                />
                <label htmlFor="male">Nam</label>
              </div>
              <div style={{ marginLeft: 15 }}>
                <input
                  style={{ marginRight: 5 }}
                  type="radio"
                  name="gender"
                  onChange={(e) => setGender(e.target.value)}
                  id="female"
                />
                <label htmlFor="female">Nữ</label>
              </div>
            </div>
            <div style={{ fontFamily: 'sans-serif' }} className="form-content">
              <div style={{ fontSize: 15 }}>Ngày sinh</div>
              <div>
                <input
                  style={{ width: 200 }}
                  value={date} // Sử dụng state date để hiển thị giá trị và ghi nhận thay đổi
                  type="date"
                  className="input-password"
                  max={new Date().toISOString().split('T')[0]} // Đặt giá trị max là ngày hiện tại
                  onChange={(e) => {
                    const selectedDate = new Date(e.target.value);
                    const currentDate = new Date();
                    if (selectedDate > currentDate) {
                      // Kiểm tra nếu ngày chọn lớn hơn ngày hiện tại
                      alert('Vui lòng chọn ngày trước ngày hiện tại.');
                      return;
                    }
                    setDate(e.target.value);
                  }}
                  placeholder="ngày sinh"
                />
              </div>
            </div>
            <button
              style={{ margin: 15 }}
              className="button-password"
              onClick={handleClickLogin}>
              Đăng ký
            </button>
            <button
              style={{ marginBottom: 5 }}
              className="button-phone"
              onClick={() => navigate(-1)}>
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
