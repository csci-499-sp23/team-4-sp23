import React from 'react';
import sitelogo from '../img/SiteLogo.png';
const Home = () => {
  return (
    <div>
      <div className="row title-section">
        <div className="col-lg-6">
          <img src={sitelogo} alt="logo" className="site-logo"></img>
        </div>
        <div className="col-lg-6">
          <h1>Nervous about moving out for the first time? Wheel Call You has got your back!</h1>
          <a className="btn btn-primary btn-lg home-button" href="signup">Sign Up Now!</a>
        </div>
      </div>
      <div id="about">
        <h1>About</h1>
        <div className='Details'>
          <h2>What is Wheel Call You?</h2>
          <p>Wheel Call You is an app aimed to help alleviate the move-in process for college students. This is done by pairing them up with a roommate based on their personalities/preferences. Not only will you find the best partner to share your new place with, but also automatically split the costs for the move-in process to assist each other financially.</p>
        </div>
        <hr></hr>
        <div className="Details">
          <h2>Who can use this app?</h2>
          <p>College students who are registered under a valid university. </p>
        </div>
        <hr></hr>
        <div className='Details'>
          <h2>Schools We're Working With</h2>
          <p>To uphold our credibility, here are a few of the schools we are currently partnered with:</p>
          <ul>
            <li>Columbia University</li>
            <li>Fordham University</li>
            <li>New York University</li>
            <li>Hunter College</li>
            <li>Barnard College</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default Home;