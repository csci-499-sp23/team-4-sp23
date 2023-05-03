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
        <a className="fa-brands fa-twitter fa-lg social-icon" href="https://twitter.com/">_</a>
        <a className="fa-brands fa-facebook fa-lg social-icon" href="https://www.facebook.com/">_</a>
        <a className="fa-brands fa-instagram fa-lg social-icon" href="https://www.instagram.com/">_</a>
        <a className="fa-solid fa-envelope fa-lg social-icon" href="https://accounts.google.com/InteractiveLogin/signinchooser?continue=https%3A%2F%2Fmail.google.com%2Fmail%2Fu%2F0%2F&emr=1&followup=https%3A%2F%2Fmail.google.com%2Fmail%2Fu%2F0%2F&osid=1&passive=1209600&service=mail&ifkv=Af_xneH91iebTo2phuGcuYggnQ8OY_UNx6NlQ3Mx0aqJt1BGg8Rr7mSIqwqZ3VQ5atZNjrPwvNPF&flowName=GlifWebSignIn&flowEntry=ServiceLogin">_</a>
        <p className="footer-text">© Copyright 2023 Wheel Call You</p>
      </footer>
    </div>
  );
};
export default Home;
