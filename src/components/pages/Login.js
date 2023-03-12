import React from 'react';
const Login = () =>{
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
            <input type="submit" value="Submit"></input>
        </form>
    </div>
    );
};
export default Login;