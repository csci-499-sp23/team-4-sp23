import React from 'react';
import sitelogo from '../img/SiteLogo.png';
const Home = () =>{
    return(
    <div>
        <div className='Home-top'>
          <h1>Welcome to Wheel Call You, where we make your moving experience that much better!</h1>
          <img src= {sitelogo} alt="logo" className = "SiteLogo"/>
        </div>
        
    </div>
    );
};
export default Home;