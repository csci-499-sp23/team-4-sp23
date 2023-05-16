import React from 'react';
import { useState } from 'react';
import { collection, getDocs, query, where } from "firebase/firestore";
import { signInWithEmailAndPassword } from '@firebase/auth'
import { useHostProfileInitialize } from '../../services/accountService';
import { db, auth } from "../../firebase-config";
import { useNavigate } from 'react-router-dom';

const ParentProfilePage = () => {
    const [PIN, setPIN] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { loadProfile } = useHostProfileInitialize({ initialize: false })
    const navigate = useNavigate();
    const enterChildProfile = async(e) => {
        e.preventDefault();
        const _where = where('pin', '==', PIN);
        const childCollectionRef = collection(db, 'students');
        const childResponse = await getDocs(query(childCollectionRef, _where));
        if (childResponse.docs.length) {
            signInWithEmailAndPassword(auth, email, password).then(async authUser => {
                if ((authUser.user.emailVerified)) { //This will return true or false
                    const { type } = await loadProfile(authUser.user)
                    const destination = { student: "/StudentProfilePage", parent: "/ParentProfilePage" }[type]
                    navigate(destination);
                }  else if ((authUser.user.emailVerified) && (authUser.pin !== PIN)) {
                    alert('Incorrect PIN');
                } else {
                    alert('email not verified');
                }
            })
        } 
        else {
            alert("Please enter a valid PIN");
        }
        
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        enterChildProfile(e);
    }

    return (
        <div className="mb-3 fields">
            <h2>Before you get started...</h2>
            <form onSubmit={handleSubmit}>
                <br></br>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                </div>
                <label htmlFor="pin" className="form-label">Enter your child's designated PIN number:</label>
                <input type="text" className="form-control" id="pin" name="pin" value={PIN} onChange={(e) => setPIN(e.target.value)}></input>
                <br></br>
                <button className="btn btn-primary" role="button" type="submit">Submit</button>
            </form>
        </div>
    )
}
export default ParentProfilePage;
