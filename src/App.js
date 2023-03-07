import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router";
import { withRouter } from 'react-router';
import './App.css';
import sitelogo from './SiteLogo.png';
import Navbar from './components/navbar/Navbar.js';
import Login from './components/pages/Login.js';
import About from './components/pages/About.js';
import Contact from './components/pages/Contact.js';
import SignUp from './components/pages/SignUp.js';
function App() {
  return (
    <div className="App">
      <Router>
        <Navbar/>
        <Routes>
          <Route exact path='/' element={<App />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signUp' element={<SignUp />} />
        </Routes>
      </Router>
      <header className="App-header">
        <img src= {sitelogo} alt="logo" />
        <p>
          Welcome to Wheel Call You, where we make your moving experience that much better! To get started, please click the button below:
        </p>
        <button
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Sign Up Now!
        </button>
      </header>
    </div>
  );
}

export default App;
