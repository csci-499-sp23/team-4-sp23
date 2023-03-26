import { createUserWithEmailAndPassword, sendEmailVerification } from '@firebase/auth';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase-config';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const signUp = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
            console.log(userCredential);
            sendEmailVerification(userCredential.user);
            auth.signOut();
            navigate("/VerifSent");
        }).catch((error) => {
            alert(error);
        });
    }
    return (
        <div className="container-fluid">
            <h2>Sign Up!</h2>
            <form>
                <div className="mb-3 fields">
                    <label for="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                </div>
                <div class="mb-3 fields">
                    <label for="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                </div>
                <a class="btn btn-primary" href="/StudentProfilePage" onClick={signUp} role="button">Submit</a>
            </form>
        </div>
    );
};
export default SignUp;
