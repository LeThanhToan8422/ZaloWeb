import { useState } from "react"
import "../../sass/Login.scss"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const Login = () => {
    let navigate = useNavigate()

    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")

    let handleClickLogin = async() => {
        let datas = await axios.post("http://localhost:8080/account", {
            phone : phone,
            password : password
        })
        if(datas.data.id > 0){
            navigate("/home", {state : {
                userId : datas.data.id
            }});
        }
    }

  return (
    <div className="container-login">
        <div className="form-login">
            <span className="title">Zalo</span>
            <span className="content">
                Đăng nhập tài khoản Zalo <br/>
                để kết nối với ứng dụng Zalo Web
            </span>
            <div className="form">
                <div className="choose-login">
                    <span>VỚI MÃ QR</span>
                    <span>VỚI SỐ ĐIỆN THOẠI</span>
                </div>
                <div className="form-content">
                    <i className="fa-solid fa-mobile-screen-button icon"></i>
                    <select name="phone" id="" className="select-national">
                        <option value={84}>+84</option>
                    </select>
                    <input value={phone} type="text" className="input-phone" placeholder="Số điện thoại"
                    onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
                <div className="form-content">
                    <i className="fa-solid fa-lock icon"></i>
                    <input value={password} type="password" className="input-password" placeholder="Mật khẩu"
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button className="button-password" onClick={handleClickLogin}>Đăng nhập với mật khẩu</button>
                <button className="button-phone">Đăng nhập bằng thiết bị di động</button>
                <span className="forget-password">Quên mật khẩu?</span>
            </div>
        </div>
        <div className="language">
            <span>Tiếng Việt</span>
            <span>English</span>
        </div>
    </div>
  )
}

export default Login