import React from 'react';
import { Link } from "react-router-dom";
import AuthDetails from '../pages/AuthDetails';

const Navbar= () =>{
    return(
    <div className ="Navbar">
        <div>
            <Link to='/home'><img src= {require('../img/NavbarLogo.png')} alt='Logo' className = 'NavLogo'></img></Link>
        </div>
        <div>
            <Link to='/about'className = "NavButtons">About</Link>
        </div>
        <div>
            <Link to='/contact' className = "NavButtons">Contact Us</Link>
        </div>
        <div>
            <Link to= '/login' className = "NavButtons">Login</Link>
        </div>
        <div>
            <Link to= '/signUp' className = "NavButtons">Sign Up</Link>
        </div>
        <AuthDetails/>
    </div>
    );
};
export default Navbar;