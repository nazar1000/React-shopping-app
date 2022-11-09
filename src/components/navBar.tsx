import "./navBar.scss"
import basket_icon from '../icons/basket_icon.png';
import search_icon from '../icons/search_icon.png';
import logo from '../icons/logo.png'
import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';

type NavBarProps = {
  basketTotal: number,
  // search: Function,
  cookie: any,
  signOut: Function,
}

function NavBar(props: NavBarProps) {
  // const [mobileNav, setMobileNav] = useState(window.innerWidth < 510 ? true : false);
  const [openNav, setOpenNav] = useState(window.innerWidth < 510 ? false : true);
  const [windowSize, setWindowSize] = useState(window.innerWidth);
  const [searchValue, setSearchValue] = useState("")
  const navigate = useNavigate();
  const location = useLocation()


  useEffect(() => {
    function handleResize() {
      // setMobileNav(window.innerWidth < 510 ? true : false)
      setOpenNav(window.innerWidth < 510 ? false : true)
      setWindowSize(window.innerWidth);
    }
    window.addEventListener('resize', handleResize)
  });

  useEffect(() => {
    if (windowSize < 510) setOpenNav(false);
  }, [location])

  const closeNav = () => {
    if (windowSize < 510) setOpenNav(false);
  }

  const handleSearch = (e?: React.KeyboardEvent<HTMLInputElement>) => {
    if (e === undefined || e.key === "Enter") {
      if (searchValue !== "") navigate(`/products/${searchValue}`)
      else navigate(`/products`)
    }
  }

  return (
    <>
      <div id='nav'>
        <div className='logo'>
          <img src={logo} alt="Logo" />
        </div>

        <div id='mobile-nav-button' onClick={() => setOpenNav(!openNav)}></div>

        {(openNav) &&
          <ul id='nav_menu'>
            <li>
              <Link to="/">Home</Link> </li>
            <li>
              <Link to="products">Product</Link> </li>
            {windowSize >= 750 &&
              <div className='search_bar'>
                <input type="text" onChange={(e) => setSearchValue(e.target.value)} onKeyDown={handleSearch} placeholder='Search' value={searchValue}></input>
                <img src={search_icon} onClick={() => handleSearch()} alt="Search" />
              </div>}
            <div id='login-menu'>

              {props.cookie.user_name === undefined &&
                <>
                  <li>
                    <Link to="login">Login</Link> </li>
                  <li>
                    <Link to="register">Register</Link> </li>
                </>
              }

              {props.cookie.user_name !== undefined &&
                <li><h3 onClick={() => { closeNav(); props.signOut() }}>Sign out</h3></li>
              }

              <Link to="basket">
                <div className='basket_button' onClick={() => { closeNav(); navigate("/basket") }}>
                  <img src={basket_icon} alt="Shopping basket"></img>
                  <h3>{props.basketTotal}</h3>
                </div>
              </Link>

            </div>

          </ul>
        }
        {windowSize <= 749 &&
          <div className='search_bar'>
            <input type="text" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder='Search'></input>
            <img src={search_icon} alt="Search" />
          </div>}
      </div>
      <Outlet />
    </>
  )
}

export default NavBar;