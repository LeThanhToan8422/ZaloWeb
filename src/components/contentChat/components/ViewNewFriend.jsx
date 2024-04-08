function ViewNewFriend({name, imgFriend, img}) {
    return ( 
    <div style={{ width:"940px",height:"200px", display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', backgroundImage: "url('/public/anhbiadefault.jpg')"}}>
        <div style={{display: 'flex', alignItems: 'center', margin:"25px 0"}}>
            <img src={imgFriend} style={{width: 70, height: 70, borderRadius: "50%"}}/>
            <img src={img} style={{width: 70, height: 70, borderRadius: "50%"}}/>
        </div>
        <div>{`Bạn và ${name} đã trở thành bạn`}</div>
        <div>Hãy bắt đầu cuộc trò chuyện</div>
    </div> );
}

export default ViewNewFriend;