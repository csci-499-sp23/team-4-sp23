import React from 'react';
import { Link } from "react-router-dom";
const Navbar= () =>{
    return(
    <div>
        <li>
            <Link to='../App.js'><img src='./NavbarLogo.png' alt='Logo'></img></Link>
        </li>
        <li>
            <Link to='/about'>About</Link>
        </li>
        <li>
            <Link to='/contact'>Contact Us</Link>
        </li>
        <li>
            <Link to="/login">Login</Link>
        </li>
        <li>
            <Link to="/signUp">Sign Up</Link>
        </li>
    </div>
    );
};
export default Navbar;