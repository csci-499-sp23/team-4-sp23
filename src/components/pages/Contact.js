import React from 'react';
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase-config";

const Contact = () => {
    const [email, setEmail] = useState("");
    const [issue, setIssue] = useState("");
    const contactUsCollectionRef = collection(db, "contactUs");

    const handleSubmit = async (event) => {
        event.preventDefault();
        if(issue !== "" && issue !== null && issue !== undefined
            && email !== "" && email !== null && email !== undefined) {
            addDoc(contactUsCollectionRef, { email: email, description: issue });
            alert("Response submitted successfully!");
        }
        setEmail("");
        setIssue("");
    }

    return (
        <div className="container p-3 text-center">
            <h2>Contact Us</h2>

            <h3>Send us your email and we will get back to you!</h3>

            <form >
                <div className="mb-3">
                    <label for="exampleFormControlInput1" className="form-label" action='/contact.php' method="get">Email address</label>
                    <input type="email" className="form-control" id="exampleFormControlInput1" name="email" onChange={(e) => setEmail(e.target.value)} value={email}></input>
                </div>
                <div className="mb-3">
                    <label for="exampleFormControlTextarea1" className="form-label">Issue</label>
                    <textarea className="form-control" id="exampleFormControlTextarea1" rows="5" name="issue" onChange={(e) => setIssue(e.target.value)} value={issue}></textarea>
                </div>
                <button type="submit" onClick={handleSubmit} className="btn btn-primary">Submit</button>
            </form>

        </div>
    );
};
export default Contact;