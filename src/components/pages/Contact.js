import React from 'react';
const Contact = () => {
    return (
        <div className="container-fluid">
            <h2>Contact Us</h2>

            <h3>Send us your email and we will get back to you!</h3>

            <form >
                <div class="mb-3 fields">
                    <label for="exampleFormControlInput1" class="form-label" action='/contact.php' method="get">Email address</label>
                    <input type="email" class="form-control" id="exampleFormControlInput1" name="email"></input>
                </div>
                <div class="mb-3 fields">
                    <label for="exampleFormControlTextarea1" class="form-label">Issue</label>
                    <textarea class="form-control" id="exampleFormControlTextarea1" rows="5" name="issue"></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>

        </div>
    );
};
export default Contact;
