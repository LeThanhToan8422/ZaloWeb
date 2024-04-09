import moment from "moment";

function ViewNewFriend({ name, imgFriend, img, dateTimeSend }) {
  return (
    <>
      <span style={{
        padding : "5px 15px",
        borderRadius : "15px",
        margin : "15px 0px",
        color : "white",
        backgroundColor : "#B6B7BC"
      }}>{moment(dateTimeSend).format('DD/MM/YYYY')}</span>
      <div
        style={{
          width: "500px",
          height: "200px",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          backgroundImage: "url('/public/anhbiadefault.jpg')",
          borderRadius: "10px",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", margin: "25px 0" }}
        >
          <img
            src={imgFriend}
            style={{ width: 70, height: 70, borderRadius: "50%" }}
          />
          <img
            src={img}
            style={{ width: 70, height: 70, borderRadius: "50%" }}
          />
        </div>
        <div>{`Bạn và ${name} đã trở thành bạn`}</div>
        <div>Hãy bắt đầu cuộc trò chuyện</div>
      </div>
    </>
  );
}

export default ViewNewFriend;
