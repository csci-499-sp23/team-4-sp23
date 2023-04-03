import {BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Navbar from './components/navbar/Navbar.js';
import Home from './components/pages/Home.js';
import Login from './components/pages/Login.js';
import Contact from './components/pages/Contact.js';
import SignUp from './components/pages/SignUp.js';
import RentalMap from './components/pages/RentalMap.js'
import Survey from './components/pages/Survey'
import BrowseStudents from './components/pages/BrowseStudents.js';
import VerifSent from './components/pages/VerifSent.js';
import StudentProfilePage from './components/pages/StudentProfilePage.js'

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar/>
        <Routes>
          <Route path='/home' element={<Home />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='rentalMap' element={<RentalMap />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signUp' element={<SignUp />} />
          <Route path='/browseStudents' element={<BrowseStudents />} />
          <Route path='/StudentProfilePage' element={<StudentProfilePage />}/>
          <Route path='/rentalMap' element={<RentalMap />} />
          <Route path='/survey' element={<Survey />} />
          <Route path='/verifSent' element={<VerifSent />} />
          <Route path='*' element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
