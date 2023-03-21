import React from 'react';
const Contact = () =>{
    return(
    <div>
        <h1>Contact Us</h1>

        <h3>Give us your email and we will get back to you!</h3>

        <form action='/contact.php' method="get">
            <label for="email">Email Address</label>
            <br></br>
            <input type="text" id="username" name="username"></input>
            <br></br><br></br>
            <label for="issue">Issue</label>
            <br></br>
            <textarea id="issue" name='issue' rows="5" cols ="50"></textarea>
            <br></br><br></br>
            <input type="submit"></input>
        </form>
    </div>
    );
};
export default Contact;
