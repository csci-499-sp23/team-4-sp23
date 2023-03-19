import React from 'react';
const SignUp = () =>{
    return(
        <div>
        <h1>Sign Up</h1>

        <form action='/signUp.php' method="get">
            <label for="fName">First Name</label>
            <br></br>
            <input type="text" id="fName" name="fName"></input>
            <br></br>
            <label for="lName">Last Name</label>
            <br></br>
            <input type="text" id="lName" name="lName"></input>
            <br></br>
            <label for="email">Email Address</label>
            <br></br>
            <input type="text" id="email" name="email"></input>
            <br></br>
            <label for="username">Username</label>
            <br></br>
            <input type="text" id="username" name="username"></input>
            <br></br>
            <label for="password">Password</label>
            <br></br>
            <input type="password" id="password" name="password"></input>
            <br></br>
            <label for="password">Confirm Password</label>
            <br></br>
            <input type="password" id="password" name="password"></input>
            <br></br><br></br>
            <input className = "Signup-button" type="submit" value="Submit"></input>
        </form>
    </div>
    );
};
export default SignUp;
