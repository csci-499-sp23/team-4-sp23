import React from "react";
import AuthDetails from "../pages/AuthDetails";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <NavLink className="navbar-brand " to="/home">
        Wheel Call You
      </NavLink>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
        <span className="navbar-toggler-icon"></span>
      </button>
      <AuthDetails />
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <NavLink className="nav-link" to="/match">
              Match
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/contact">
              Contact
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/rentalMap">
              Map
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/login">
              Login
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/survey">
              Survey
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/parentProfilePage">
              Parent
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link btn btn-primary" to="signup">
              Sign Up Now!
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};
export default Navbar;
