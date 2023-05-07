import { createUserWithEmailAndPassword, sendEmailVerification } from '@firebase/auth';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase-config';
import { collection, getDocs, addDoc } from "@firebase/firestore";

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('Student');
    let domainsJSON = [];
    let domains = [];
    const studentsCollectionRef = collection(db, "students");
    const parentsCollectionRef = collection(db, "parents");
    const colRef = collection(db, 'auth_domains');

    getDocs(colRef).then((snapshot) => {

        snapshot.docs.forEach((doc) => {
            domainsJSON.push({ ...doc.data(), id: doc.id })
        })
        domainsJSON.map((domain) => (
            domains.push(domain.domain)
        ))
    }).catch(err => {
        console.log(err.message);
    })

    const navigate = useNavigate();

    const signUp = async (e) => {
        e.preventDefault();
        if(email.length === 0){
            alert("Please enter your email.")
        }
        else if(email.search("@") === -1){
            alert("Please enter a valid email.")
        }
        else if(password.length < 6){
            alert("Password must be at least 6 characters.")
        }

        else if (domains.includes((email.substring(email.indexOf('@'))).toLowerCase()) && userType === "Student") {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await addDoc(studentsCollectionRef, { email: userCredential.user.email, first_name: firstName, last_name: lastName });
                sendEmailVerification(userCredential.user);
                auth.signOut();
                navigate("/VerifSent");
            } catch (error) {
                console.error(error);
            }
        }
        else if (domains.includes((email.substring(email.indexOf('@'))).toLowerCase()) && (userType === 'Parent')) {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await addDoc(parentsCollectionRef, { email: userCredential.user.email, first_name: firstName, last_name: lastName });
                sendEmailVerification(userCredential.user);
                auth.signOut();
                navigate("/VerifSent");
            } catch (error) {
                console.error(error);
            }
        }  
        else {
            alert("The email domain you are using is not authorized")
        }
    }
    return (

        <div className="container p-3 text-center">
            <h2>Sign Up!</h2>
            <form>
                <div className="mb-3">
                    <label for="first_name" className="form-label">First Name</label>
                    <input required type="text" className="form-control" value={firstName} onChange={(e) => setFirstName(e.target.value)}></input>
                </div>
                <div className="mb-3">
                    <label for="last_name" className="form-label">Last Name</label>
                    <input required type="text" className="form-control" value={lastName} onChange={(e) => setLastName(e.target.value)}></input>
                </div>
                <div className="mb-3">
                    <label for="email" className="form-label">Email address</label>
                    <input required type="email" className="form-control" id="exampleInputEmail1" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                </div>
                <div className="mb-3">
                    <label for="password" className="form-label">Password</label>
                    <input required type="password" className="form-control" id="exampleInputPassword1" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                </div>
                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" checked={userType === 'Student'} value={'Student'} onChange={() => setUserType('Student')}></input>
                <label className="form-check-label" for="flexRadioDefault1">
                    I'm a student
                </label>
                <br></br>
                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked={userType === 'Parent'} value={'Parent'} onChange={() => setUserType('Parent')}></input>
                <label className="form-check-label" for="flexRadioDefault2">
                    I'm a parent
                </label>
                <br></br>
                <br></br>
                <a className="btn btn-primary" href="/VerifSent" onClick={signUp} role="button">Submit</a>
            </form>

        </div>
    );
};
export default SignUp;
