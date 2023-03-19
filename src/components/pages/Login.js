import React from 'react';
import { useNavigate} from 'react-router-dom'

const Login = () =>{
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/RentalMap");
    }

    var loggedIn = false;
    return(
    <div>
        <h1>Login</h1>

        <form action='/login.php' method="get">
            <label for="username">Username</label>
            <br></br>
            <input type="text" id="username" name="username"></input>
            <br></br><br></br>
            <label for="password">Password</label>
            <br></br>
            <input type="password" id="password" name="password"></input>
            <br></br><br></br>
            <button type="submit" value="Submit" onClick={handleSubmit}></button>
        </form>
    </div>
    );
};
export default Login;