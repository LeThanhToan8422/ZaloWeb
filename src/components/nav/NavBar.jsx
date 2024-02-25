import { useEffect, useState } from "react";
import "../../sass/NavBar.scss";
import axios from "axios";

const NavBar = ({ userId }) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    let getApiUserById = async () => {
      let datas = await axios.get(`http://localhost:8080/user/${userId}`);
      setUser(datas.data);
    };
    getApiUserById();
  }, [userId]);

  return (
    <div className="container-nav-bar">
      <div className="nav-avt">
        <img
          src={user.image}
          alt=""
          style={{
            width: 50,
            height: 50,
            border: "1px solid white",
            borderRadius: "50%",
            cursor : "pointer"
          }}
        />
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
