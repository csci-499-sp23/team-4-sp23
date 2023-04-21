//import React, { useEffect, useState } from "react";
import { signOut } from "@firebase/auth";
//import { onAuthStateChanged}from "@firebase/auth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase-config";
//import { useSelector} from "react-redux";
import { logout } from "../../services/appSlice";
import { useUserSelector } from "../../services/selectors";

const AuthDetails = () => {
  const authUser = useUserSelector();
  const dispatch = useDispatch();
  //   const [authUser, setAuthUser] = useState(null);

  const navigate = useNavigate();

  const userSignOut = () => {
    signOut(auth);
    dispatch(logout());

    navigate("/Login");
  };
  return (
    <div className="d-flex">
      {authUser ? (
        <div className="d-flex gap-2">
          {/* <NavLink to='/StudentProfilePage'> {authUser?.email}</NavLink> */}
          <button className="btn btn-secondary" onClick={userSignOut}>
            Sign Out
          </button>
        </div>
      ) : (
        <p>Signed Out</p>
      )}
    </div>
  );
};

export default AuthDetails;
