import { useState } from "react"
import "../../sass/Login.scss"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const InfoAccount = () => {
    let navigate = useNavigate()

    const [phone, setPhone] = useState("0329623380")
    const [password, setPassword] = useState("123456789")
    const [isLoginByPhone, setIsLoginByPhone] = useState(true);

    let handleClickLogin = async() => {
        let datas = await axios.post("http://localhost:8080/login", {
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
        <div className="form-login" style={{height: "80%"}}>
            <span className="title">Zalo</span>
            <span className="content">
                Đăng ký tài khoản Zalo <br/>
                để kết nối với bạn bè
            </span>
            <div className="form" >
                <div className="choose-login">
                    <span style = {{color:  "#056BFF"}}>ĐĂNG KÝ</span>
                </div>
                <div className="login-by-phone">
                <div className="form-content">
                        <i className="fa-solid fa-lock icon"></i>
                        <input type="password" className="input-password" placeholder="Mật khẩu"
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-content">
                        <i className="fa-solid fa-lock icon"></i>
                        <input type="password" className="input-password" placeholder="Xác nhận mật khẩu"
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <h4>Thông tin tài khoản</h4>
                    
                    <div className="form-content">
                        <input value="" type="text" className="input-password" placeholder="Tên tài khoản"
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-content-gender">
                        <input type="radio" name="gender" 
                        onChange={(e) => setPassword(e.target.value)} id="male" checked
                        />
                        <label htmlFor="male">Nam</label>
                        <input type="radio"  name="gender" 
                        onChange={(e) => setPassword(e.target.value)} id="female"
                        />
                        <label htmlFor="female">Nữ</label>
                    </div>
                    <div className="form-content">
                        <input value="" type="date" className="input-password"
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    
                    <button className="button-password" onClick={handleClickLogin}>Đăng ký</button>
                    <button className="button-phone" onClick={()=> navigate(-1)}>Quay lại</button>
                </div>
                
                
            </div>
        </div>
        <div className="language">
        </div>
    </div>
  )
}

export default InfoAccount