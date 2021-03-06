import basket_icon from '../icons/basket_icon.png';
import search_icon from '../icons/search_icon.png';
import logo from '../icons/logo.png'
import { useState } from 'react';
import { useEffect } from 'react';

function NavBar(props) {
    const [mobileNav, setMobileNav] = useState(window.innerWidth < 510 ? true : false);
    const [openNav, setOpenNav] = useState(window.innerWidth < 510 ? false : true);
    const [windowSize, setWindowSize] = useState(window.innerWidth);


    useEffect(() => {
        function handleResize() {
            setMobileNav(window.innerWidth < 510 ? true : false)
            setOpenNav(window.innerWidth < 510 ? false : true)
            setWindowSize(window.innerWidth);
        }
        window.addEventListener('resize', handleResize)
    });

    const closeNav = () => {
        if (windowSize < 510) setOpenNav(false);
    }

    return (
        <div id='nav'>
            <div className='logo'>
                <img src={logo} />
            </div>

            <div id='mobile-nav-button' onClick={() => setOpenNav(!openNav)}></div>


            {(openNav) &&
                <ul id='nav_menu'>
                    <li><h3 onClick={() => { closeNav(); props.setPage("home"); props.setFormType("products") }}>Home</h3></li>
                    <li><h3 onClick={() => { closeNav(); props.setPage("products"); props.setFormType("products") }}>Product</h3></li>
                    {windowSize >= "750" &&
                        <div className='search_bar'>
                            <input type="text" onChangeCapture={(e) => { props.search(e.target.value) }} placeholder='Search'></input>
                            <img src={search_icon} />
                        </div>}
                    <div id='login-menu'>

                        {props.cookie.user_name == undefined &&
                            <>
                                <li><h3 onClick={() => { closeNav(); props.setPage("login"); props.setFormType("login") }}>Login</h3></li>
                                <li><h3 onClick={() => { closeNav(); props.setPage("login"); props.setFormType("register") }}>Register</h3></li>
                            </>
                        }

                        {props.cookie.user_name != undefined &&
                            <li><h3 onClick={() => { closeNav(); props.signOut() }}>Sign out</h3></li>
                        }


                        <div className='basket_button' onClick={() => { closeNav(); props.setPage("basket") }}>
                            <img src={basket_icon}></img>
                            <h3>{props.basketTotal}</h3>
                        </div>

                    </div>

                </ul>
            }
            {windowSize <= "749" &&
                <div className='search_bar'>
                    <input type="text" onChangeCapture={(e) => { props.search(e.target.value) }} placeholder='Search'></input>
                    <img src={search_icon} />
                </div>}
        </div>
    )
}

export default NavBar;