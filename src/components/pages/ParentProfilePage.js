import React from 'react';
import ReactDOM from "react-dom/client";
import { useState } from 'react';
const ParentProfilePage = () => {
    const [email, setEmail] = useState("");
    return (
        <div className="mb-3 fields">
            <h2>Before you get started...</h2>
            <br></br>
            <label for="email" className="form-label">Enter your child's email address:</label>
            <input type="email" className="form-control" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
            <br></br>
            <a className="btn btn-primary" href="/VerifSent" role="button">Submit</a>
            <br></br>
            <br></br>
            <a href="/StudentProfilePage" class="btn btn-primary" role="button">Switch to Student</a>
        </div>
    )
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ParentProfilePage />);
export default ParentProfilePage;
