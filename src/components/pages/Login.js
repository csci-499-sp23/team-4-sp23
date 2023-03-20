import { signInWithEmailAndPassword } from '@firebase/auth'
import { auth } from '../../firebase-config'
import React, { useState } from 'react';
import { useNavigate} from 'react-router-dom'


const Login = () =>{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const signIn = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password);
    }

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        signIn(e);
        navigate("/RentalMap");
    }

    return(
    <div>
        <h1>Login</h1>

        <form>
            <label for="email">Email Address</label>
            <br></br>
            <input 
                type="email" 
                id="email" 
                name="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
            ></input>
            <br></br><br></br>
            <label for="password">Password</label>
            <br></br>
            <input 
                type="password" 
                id="password" 
                name="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
            ></input>
            <br></br><br></br>
            <button className="Login-button" type="submit" value="Submit" onClick={handleSubmit}>Submit</button>
        </form>
    </div>
    );
};
export default Login;
