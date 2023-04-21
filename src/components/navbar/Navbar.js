import React, { useCallback } from "react";
import AuthDetails from "../pages/AuthDetails";
import { NavLink, useNavigate } from "react-router-dom";
import { useUserSelector } from "../../services/selectors";
import { auth } from "../../firebase-config";
import { useDispatch } from "react-redux";
import { logout } from "../../services/appSlice";

const SignedIn = ({ children }) => {
  const user = useUserSelector();
  return user ? children : <></>;
};

const SignedOut = ({ children }) => {
  const user = useUserSelector();

  return !user ? children : <></>;
};
const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signOut = (e) => {
    // e?.preventDefault()
    signOut(auth);
    // dispatch(logout());

    // navigate("/Login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <NavLink className="navbar-brand " to="/home">
        Wheel Call You
      </NavLink>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
        <span className="navbar-toggler-icon"></span>
      </button>
      {/* <AuthDetails /> */}
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
          <SignedOut>
            <li className="nav-item">
              <NavLink className="nav-link" to="/login">
                Login
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link btn btn-primary" to="signup">
                Sign Up Now!
              </NavLink>
            </li>
          </SignedOut>
          <SignedIn>
            <li className="nav-item">
              <NavLink className="nav-link" to="/survey">
                Survey
              </NavLink>
            </li>

            {/* <li className="nav-item">
              <button className="nav-link btn btn-primary" onClick={(e) => signOut(e)}>
                Logout
              </button>
            </li> */}
            <AuthDetails/>
            <li className="nav-item">
              <NavLink className="nav-link btn btn-primary" to="signup">
                Account
              </NavLink>
            </li>
          </SignedIn>
        </ul>
      </div>
    </nav>
  );
};
export default Navbar;
