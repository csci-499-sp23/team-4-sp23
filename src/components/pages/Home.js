import React from 'react';
import sitelogo from '../img/SiteLogo.png';
const Home = () => {
  return (
    <div>
      <section id="title-section">
        <div className="row">
          <div className="col-lg-6">
            <img src={sitelogo} alt="logo" className="site-logo"></img>
          </div>
          <div className="col-lg-6">
            <h1>Nervous about moving out for the first time? Wheel Call You has got your back!</h1>
            <a className="btn btn-primary btn-lg home-button" href="signup">Sign Up Now!</a>
          </div>
        </div>
      </section>
      <section id="feature-section">
        <div className="row row-padding">
          <div className="feature-box col-lg-4">
            <i className="fa-solid fa-circle-check fa-4x feature-icons"></i>
            <h3>Verified and Trustworthy</h3>
            <p>We are partnered up with 200+ universities and colleges across New York.</p>
          </div>
          <div className="feature-box col-lg-4">
            <i className="fa-sharp fa-solid fa-people-arrows fa-4x feature-icons"></i>
            <h3>Intuitive Matchmaking System</h3>
            <p>We will find you the best roommate based on your preferences and personality.</p>
          </div>
          <div className="feature-box col-lg-4">
            <i className="fa-solid fa-truck-moving fa-4x feature-icons"></i>
            <h3>Affordable Moving Costs</h3>
            <p>Save big by choosing amongst a wide selection of avaiable rental services.</p>
          </div>
        </div>
      </section>
      <footer id="footer">
        <i className="fa-brands fa-twitter fa-lg social-icon"></i>
        <i className="fa-brands fa-facebook fa-lg social-icon"></i>
        <i className="fa-brands fa-instagram fa-lg social-icon"></i>
        <i className="fa-solid fa-envelope fa-lg social-icon"></i>
        <p className="footer-text">© Copyright 2023 Wheel Call You</p>
      </footer>
    </div>
  );
};
export default Home;