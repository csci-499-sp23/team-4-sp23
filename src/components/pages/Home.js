import React from 'react';
import sitelogo from './SiteLogo.png';
const Home = () =>{
    return(
    <div>
        <header className="App-header">
        <img src= {sitelogo} alt="logo" className = "SiteLogo"/>
        <p>
          Welcome to Wheel Call You, where we make your moving experience that much better!
        </p>
      </header>
    </div>
    );
};
export default Home;