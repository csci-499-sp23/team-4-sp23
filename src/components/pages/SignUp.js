import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from '@firebase/auth'
import { auth } from '../../firebase-config'

const SignUp = () =>{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signUp = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
            console.log(userCredential);
        }).catch((error) => {
            console.log(error);
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
                placeholder="Enter your email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}>
            </input>
            <br></br>
            <label for="email">Password</label>
            <br></br>
            <input 
                type="password" 
                placeholder="Enter your password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}>
            </input>
            <br></br>
            <br></br>
            <button type="submit">Sign Up</button>
        </form>
    </div>
    );
};
export default SignUp;