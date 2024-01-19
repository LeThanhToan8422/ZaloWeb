import "../../sass/NavBar.scss"

const NavBar = () => {
  return (
    <div className='container-nav-bar'>
      <div className='nav-avt'></div>
      <div className='nav-group'>
        <div className='nav-group-chat'>
          <div className='group-icon'><i className="fa-regular fa-comment-dots icon"></i></div>
          <div className='group-icon'><i className="fa-regular fa-address-book icon"></i></div>
          <div className='group-icon'><i className="fa-regular fa-square-check icon"></i></div>
        </div>
        <div className='nav-group-utilities'>
          <div className='group-icon'><i className="fa-solid fa-cloud icon"></i></div>
          <div className="group-icon"><i className="fa-solid fa-toolbox icon"></i></div>
          <div className='group-icon'><i className="fa-solid fa-gear icon"></i></div>
        </div>
      </div>
    </div>
  )
}

export default NavBar