import { onAuthStateChanged } from "@firebase/auth";
import { LoadScript } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Protected from "./Protected";
import Navbar from "./components/navbar/Navbar.js";
import Admin from "./components/pages/Admin";
import BrowseStudents from "./components/pages/BrowseStudents.js";
import Contact from "./components/pages/Contact.js";
import Home from "./components/pages/Home.js";
import Login from "./components/pages/Login.js";
import Match from "./components/pages/Match";
import ParentProfilePage from "./components/pages/ParentProfilePage.js";
import SignUp from "./components/pages/SignUp.js";
import StudentProfilePage from "./components/pages/StudentProfilePage.js";
import Survey from "./components/pages/Survey";
import VerifSent from "./components/pages/VerifSent.js";
import { auth } from "./firebase-config";
import { useHostProfileInitialize } from "./services/accountService";
import { login, logout } from "./services/appSlice";

const AdminGaurd = ({ element }) => {
  const { hostProfile } = useHostProfileInitialize()

  if (!hostProfile) {
    return <Spinner />
  }
  if (hostProfile.type === 'admin') {
    const destination = { student: '/StudentProfile', parent: '/ParentProfile' }[hostProfile.type]
    return <Navigate to={destination} />
  }
  return element
}

function App() {
  // const  = useSelector((store) => store.appStore);
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    let unsubscribe;
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        dispatch(login(user.toJSON()));

      } else {
        setIsLoggedIn(false);
        dispatch(logout());
      }
    });

    return () => {
      listen();
      if (unsubscribe) {
        unsubscribe()
      }
    };
  }, [dispatch]);

  // const functions = require('firebase-functions');
  // const express = require('express');
  // const app = express();

  // app.get('/cors', (req, res) => {
  //   res.set('Access-Control-Allow-Origin', '*');
  //   res.send({ "msg": "This has CORS enabled 🎈" })
  // });

  // exports.app = functions.https.onRequest(app);
  const aLibraries = ['geometry'];
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/browseStudents" element={<BrowseStudents />} />
          <Route path="/admin" element={<AdminGaurd element={<Admin />} />} />
          <Route
            path="/StudentProfilePage"
            element={
              <Protected isLoggedIn={isLoggedIn}>
                <StudentProfilePage />
              </Protected>
            }
          />
          <Route path="/parentProfilePage" element={<ParentProfilePage />} />
          <Route path="/verifSent" element={<VerifSent />} />
          <Route path="/survey" element={<Survey />} />
          <Route path="/match" element={
            <Match />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Router>
      <LoadScript googleMapsApiKey='AIzaSyDhz3m22jJJjC6BOX83Qbjdm2FaQiXVK4A' libraries={aLibraries}>
      </LoadScript>
    </div>
  );
}

export default App;
