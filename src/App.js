import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "@firebase/auth";
import { auth } from "./firebase-config";
import "./App.css";
import Protected from "./Protected";
import Navbar from "./components/navbar/Navbar.js";
import Home from "./components/pages/Home.js";
import Login from "./components/pages/Login.js";
import Contact from "./components/pages/Contact.js";
import SignUp from "./components/pages/SignUp.js";
import RentalMap from "./components/pages/RentalMap.js";
import BrowseStudents from "./components/pages/BrowseStudents.js";
import VerifSent from "./components/pages/VerifSent.js";
import Survey from "./components/pages/Survey";
import StudentProfilePage from "./components/pages/StudentProfilePage.js";
import Match from "./components/pages/Match";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "./services/appSlice";

function App() {
  // const  = useSelector((store) => store.appStore);
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        dispatch(login(user));
      } else {
        setIsLoggedIn(false);
        dispatch(logout());
      }
    });

    return () => {
      listen();
    };
  }, []);

  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="rentalMap" element={<RentalMap />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/browseStudents" element={<BrowseStudents />} />
          <Route
            path="/StudentProfilePage"
            element={
              <Protected isLoggedIn={isLoggedIn}>
                <StudentProfilePage />
              </Protected>
            }
          />
          <Route path="/rentalMap" element={<RentalMap />} />
          <Route path="/verifSent" element={<VerifSent />} />
          <Route path="/survey" element={<Survey />} />
          <Route path="/match" element={<Match />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
