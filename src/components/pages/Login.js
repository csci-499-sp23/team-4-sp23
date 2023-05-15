import { signInWithEmailAndPassword, sendPasswordResetEmail } from '@firebase/auth'
import { auth } from '../../firebase-config'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHostProfileInitialize } from '../../services/accountService';
import { Button } from 'react-bootstrap';


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { loadProfile } = useHostProfileInitialize({ initialize: false })

    const navigate = useNavigate();

    const signIn = (e) => {
        e.preventDefault();

        signInWithEmailAndPassword(auth, email, password).then(async authUser => {

            if (authUser.user.emailVerified) { //This will return true or false
                const { type } = await loadProfile(authUser.user)

                const destination = { student: "/StudentProfilePage", parent: "/ParentProfilePage" }[type]
                navigate(destination);
            } else {
                auth.signOut();
                alert('email not verified');
            }
        });
    }

    const handleForgotPassword = () => {
        sendPasswordResetEmail(auth, email).then(() => {
            alert('Password reset email sent!');
        }).catch((error) => {
            alert(error.message);
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        signIn(e);
    }

    return (
        <div className="container p-4 text-center">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label for="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                </div>
                <div className="mb-3">
                    <label for="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                </div>
                <div className="mb-3">
                    <button type="button" className="btn btn-link" onClick={handleForgotPassword}>Forgot password?</button>
                </div>
                <Button className="btn btn-primary" role="button" type='submit'>Submit</Button>
            </form>
        </div>
    );
};
export default Login;