import React, { useState, useEffect } from 'react';
import ReactDOM from "react-dom/client";

const ParentProfilePage = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    return (
        <div class="row row-cols-1 row-cols-md-2 g-4">
            <div class="col">
                <div class="card">
                    <div class="card-body">
                    <h2>Parent Profile</h2>
                    <input required type="text" className="form-control" onChange={(e) => setFirstName(e.target.value)}></input>
                    <p class="card-text">Enter first name: {firstName}</p>
                    <input required type="text" className="form-control" onChange={(e) => setLastName(e.target.value)}></input>
                    <p class="card-text">Enter first name: {lastName}</p>
                    <input required type="email" className="form-control" onChange={(e) => setEmail(e.target.value)}></input>
                    <p class="card-text">Enter your email: {email}</p>
                    <button class="btn btn-primary">Submit</button>
                    <br></br>
                    <br></br>
                    <a href="/StudentProfilePage" class="btn btn-primary" role="button">Switch to Student</a>
                    </div>
                </div>
            </div>

        </div>
    )
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ParentProfilePage />);
export default ParentProfilePage;