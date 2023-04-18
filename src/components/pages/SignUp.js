import { createUserWithEmailAndPassword, sendEmailVerification } from '@firebase/auth';
import React, { useState  } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase-config';
import { collection, getDocs, addDoc } from "@firebase/firestore";

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    let domainsJSON = [];
    let domains = [];
    const studentsCollectionRef = collection(db, "students");

    const colRef = collection(db, 'auth_domains');
    
    getDocs(colRef).then((snapshot) => {
        
        snapshot.docs.forEach((doc) => {
            domainsJSON.push({...doc.data(), id: doc.id})
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
        
        if(domains.includes((email.substring(email.indexOf('@'))).toLowerCase())) {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await addDoc(studentsCollectionRef, {email: userCredential.user.email, first_name: firstName, last_name: lastName});
                sendEmailVerification(userCredential.user);
                auth.signOut();
                navigate("/VerifSent");
            } catch (error) {
                console.error(error);
            }
        } else {
            alert("The email domain you are using is not authorized")
        }
    }
    return (
        
        <div className="container-fluid">
            <h2>Sign Up!</h2>
            <form>
                <div className="mb-3 fields">
                    <label for="first_name" className="form-label">First Name</label>
                    <input required type="text" className="form-control" value={firstName} onChange={(e) => setFirstName(e.target.value)}></input>
                </div>
                <div className="mb-3 fields">
                    <label for="last_name" className="form-label">Last Name</label>
                    <input required type="text" className="form-control" value={lastName} onChange={(e) => setLastName(e.target.value)}></input>
                </div>
                <div className="mb-3 fields">
                    <label for="email" className="form-label">Email address</label>
                    <input required type="email" className="form-control" id="exampleInputEmail1" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                </div>
                <div class="mb-3 fields">
                    <label for="password" className="form-label">Password</label>
                    <input required type="password" className="form-control" id="exampleInputPassword1" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                </div>
                <a class="btn btn-primary" href="/VerifSent" onClick={signUp} role="button">Submit</a>
            </form>
        </div>
    );
};
export default SignUp;
