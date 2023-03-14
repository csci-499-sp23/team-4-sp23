import {BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Navbar from './components/navbar/Navbar.js';
import Home from './components/pages/Home.js';
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
          <Route path='/home' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signUp' element={<SignUp />} />
          <Route path='/browseStudents' element={<BrowseStudents />} />
          <Route path='*' element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
