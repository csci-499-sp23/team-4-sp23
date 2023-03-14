import React from 'react';
import { Link } from "react-router-dom";
const Navbar= () =>{
    return(
    <div className ="Navbar">
        <div className = "NavButtons">
            <Link to='/home'><img src= {require('./NavbarLogo.png')} alt='Logo' className = 'NavLogo'></img></Link>
        </div>
        <div className = "NavButtons">
            <Link to='/about'className = "NavButtons">About</Link>
        </div>
        <div className = "NavButtons">
            <Link to='/contact' className = "NavButtons">Contact Us</Link>
        </div>
        <div className = "NavButtons">
            <Link to= '/login' className = "NavButtons">Login</Link>
        </div>
        <div className = "NavButtons">
            <Link to= '/signUp' className = "NavButtons">Sign Up</Link>
        </div>
    </div>
    );
};
export default Navbar;