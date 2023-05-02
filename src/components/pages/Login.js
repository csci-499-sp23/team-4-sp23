import { signInWithEmailAndPassword, sendPasswordResetEmail } from '@firebase/auth'
import { auth } from '../../firebase-config'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const signIn = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password).then((authUser) => {
      if(password.length < 6){
        alert("Password must be at least 6 characters")
      }
      if (authUser.user.emailVerified) {
        //This will return true or false
        navigate("/StudentProfilePage");
      } else {
        auth.signOut();
        alert("Email not verified");
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signIn(e);
  };

  return (
    <div className="container-fluid">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3 fields">
          <label for="email" className="form-label">
            Email address
          </label>
          <input type="email" className="form-control" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
        </div>
        <div className="mb-3 fields">
          <label for="password" className="form-label">
            Password
          </label>
          <input type="password" className="form-control" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
        </div>
    );
};
export default Login;