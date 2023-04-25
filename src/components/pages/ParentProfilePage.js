import React, { useState } from 'react';
import ReactDOM from "react-dom/client";
import BrowseStudents from "./BrowseStudents.js";
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
                        <BrowseStudents />
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
