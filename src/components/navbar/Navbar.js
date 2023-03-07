import React from 'react';
import { Link } from "react-router-dom";
const Navbar= () =>{
    return(
    <div className ="Navbar">
        <div className = "NavButtons">
            <Link to='/App.js' className = "NavButtons"><img src='./NavbarLogo.png' alt='Logo'></img></Link>
        </div>
        <div className = "NavButtons">
            <Link to='/about'className = "NavButtons">About</Link>
        </div>
        <div className = "NavButtons">
            <Link to='/contact' className = "NavButtons">Contact Us</Link>
        </div>
        <div >
            <Link to="/login" className = "NavButtons">Login</Link>
        </div>
        <div>
            <Link to="/signUp" className = "NavButtons">Sign Up</Link>
        </div>
    </div>
    );
};
export default Navbar;