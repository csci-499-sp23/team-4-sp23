import { createUserWithEmailAndPassword, sendEmailVerification } from '@firebase/auth';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase-config';

const SignUp = () =>{
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
    return(
        <div>
        <h1>Sign Up</h1>

        <form onSubmit = {signUp}>
            <label for="email">Email Address</label>
            <br></br>
            <input 
                type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}>
            </input>
            <br></br>
            <label for="password">Password</label>
            <br></br>
            <input 
                type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}>
            </input>
            <br></br><br></br>
            <button className="Signup-button" type="submit">Sign Up</button>
        </form>
    </div>
    );
};
export default SignUp;
