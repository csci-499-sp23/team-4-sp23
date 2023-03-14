import {BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import sitelogo from './SiteLogo.png';
import Navbar from './components/navbar/Navbar.js';
import Login from './components/pages/Login.js';
import About from './components/pages/About.js';
import Contact from './components/pages/Contact.js';
import SignUp from './components/pages/SignUp.js';
import BrowseStudents from './components/pages/BrowseStudents.js';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar/>
        <Routes>
          <Route exact path='/App.js' element={<App />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signUp' element={<SignUp />} />
          <Route path='/browseStudents' element={<BrowseStudents />} />
        </Routes>
      </Router>
      <header className="App-header">
        <img src= {sitelogo} alt="logo" className = "SiteLogo"/>
        <p>
          Welcome to Wheel Call You, where we make your moving experience that much better!
        </p>
      </header>
    </div>
  );
}

export default App;
