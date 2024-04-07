import { useState } from "react";
import "../../sass/NavBar.scss";
import InfoAccount from "./components/InfoAccount";
import { useNavigate } from "react-router-dom";


const NavBar = ({ user, urlBackend }) => {
  let navigate = useNavigate();
  const [isClickAvt, setIsClickAvt]= useState(false); 
  const [visibleInfoAccount, setVisibleInfoAccount] = useState(false);

  return (
    <div className="container-nav-bar">
      <InfoAccount setVisible={setVisibleInfoAccount} visible={visibleInfoAccount} userId={user.id} urlBackend={urlBackend}/>
      <div className="nav-avt" onClick={()=> setIsClickAvt(!isClickAvt)}>
        <img
          src={user.image=="null" ?"/public/avatardefault.png":user.image}
          alt=""
          style={{
            width: 50,
            height: 50,
            border: "1px solid white",
            borderRadius: "50%",
            cursor : "pointer"
          }}
        />
        <div className="nav-avt-menu" style={{display: isClickAvt? "flex": "none"}}>
          <div className="child name">{user.name}</div>
          <div className="child profile" onClick={()=> setVisibleInfoAccount(true)}>Hồ sơ của bạn</div>
          <div className="child setting">Cài đặt</div>
          <div className="child sign-out" onClick={() => navigate("/")}>Đăng xuất</div>
        </div>
      </div>
      <div className="nav-group">
        <div className="nav-group-chat">
          <div className="group-icon">
            <i className="fa-regular fa-comment-dots icon"></i>
          </div>
          <div className="group-icon">
            <i className="fa-regular fa-address-book icon"></i>
          </div>
          <div className="group-icon">
            <i className="fa-regular fa-square-check icon"></i>
          </div>
        </div>
        <div className="nav-group-utilities">
          <div className="group-icon">
            <i className="fa-solid fa-cloud icon"></i>
          </div>
          <div className="group-icon">
            <i className="fa-solid fa-toolbox icon"></i>
          </div>
          <div className="group-icon">
            <i className="fa-solid fa-gear icon"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
