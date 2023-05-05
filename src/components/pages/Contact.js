import React from 'react';
const Contact = () => {
    return (
        <div className="container p-3 text-center">
            <h2>Contact Us</h2>

            <h3>Send us your email and we will get back to you!</h3>

            <form >
                <div className="mb-3">
                    <label for="exampleFormControlInput1" className="form-label" action='/contact.php' method="get">Email address</label>
                    <input type="email" className="form-control" id="exampleFormControlInput1" name="email"></input>
                </div>
                <div className="mb-3">
                    <label for="exampleFormControlTextarea1" className="form-label">Issue</label>
                    <textarea className="form-control" id="exampleFormControlTextarea1" rows="5" name="issue"></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>

        </div>
    );
};
export default Contact;
