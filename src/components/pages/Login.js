import { signInWithEmailAndPassword } from '@firebase/auth'
import { auth } from '../../firebase-config'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const signIn = (e) => {
        e.preventDefault();

        signInWithEmailAndPassword(auth, email, password).then(authUser => {

            if (authUser.user.emailVerified) { //This will return true or false
                navigate("/StudentProfilePage");
            } else {
                auth.signOut();
                alert('email not verified');
            }
        });
    }



    const handleSubmit = (e) => {
        e.preventDefault();
        signIn(e);

    }

    return (
        <div class="container-fluid">
            <h2>Login</h2>
            <form>
                <div className="mb-3 fields">
                    <label for="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                </div>
                <div className="mb-3 fields">
                    <label for="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                </div>
                <a class="btn btn-primary" onClick={handleSubmit} role="button">Submit</a>
            </form>
        </div>
    );
};
export default Login;
