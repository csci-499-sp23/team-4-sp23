import React, { useState, useEffect } from 'react';
import ReactDOM from "react-dom/client";
import { useUserSelector } from '../../services/selectors';
import { db } from "../../firebase-config";
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";

const StudentProfilePage = () => {
    const user = useUserSelector();
    const [bio, setBio] = useState("");
    const [location, setLocation] = useState("");
    const [USState, setUSState] = useState("");
    const [city, setCity] = useState("");
    const [zip, setZip] = useState("");
    const [dob, setDOB] = useState("");
    const [university, setUniversity] = useState("");
    const [userImage, setUserImage] = useState("https://media.istockphoto.com/id/517188688/photo/mountain-landscape.jpg?s=612x612&w=0&k=20&c=A63koPKaCyIwQWOTFBRWXj_PwCrR4cEoOw2S9Q7yVl8=");
    const [studentData, setStudentData] = useState(null);

    useEffect(() => {
        if (user?.email) {
            const studentRef = query(
                collection(db, "students"),
                where("email", "==", user.email)
            );
            
            const unsubscribe = onSnapshot(studentRef, (snapshot) => {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setStudentData(data);
                if(data.length > 0) {
                    setLocation(data[0].street_add);
                    setDOB(data[0].dob);
                }
            });
    
            return () => {
                unsubscribe();
            };
        }
    }, [user]);

    const displayStreetAddress = () => {
        if (
            user?.email && 
            studentData && 
            ((studentData[0].street_add !== undefined && studentData[0].street_add !== "") &&
            (studentData[0].state !== undefined && studentData[0].state !== "") &&
            (studentData[0].state !== undefined && studentData[0].state !== "") &&
            (studentData[0].city !== undefined && studentData[0].city !== "") &&
            (studentData[0].zip !== undefined && studentData[0].zip !== ""))
        ) {
            return (
                <div>
                    <div>{studentData[0].street_add}</div>
                    <div>{studentData[0].city}</div>
                    <div>{studentData[0].state}</div>
                    <div>{studentData[0].zip}</div>
                    <button class="btn btn-primary" onClick={clearAddress}>Clear Address</button>
                </div>
            );
        } else {
            return (
                <div>
                    <input required type="text" className="form-control" onChange={(e) => setLocation(e.target.value)}></input>
                    <p class="card-text">Please enter your street address: {location}</p>
                    <h5 class="card-title">State</h5>
                    <select class="form-select" aria-label="Default select example" onChange={(e) => setUSState(e.target.value)}>
                        <option selected>Please select your state</option>
                        <option value="MA">MA</option>
                        <option value="NJ">NJ</option>
                        <option value="NY">NY</option>
                    </select>
                    <p class="card-text">Please select your state: {USState}</p>
                    <h5 class="card-title">City</h5>
                    <input required type="text" className="form-control" onChange={(e) => setCity(e.target.value)}></input>
                    <p class="card-text">Please enter your city: {city}</p>
                    <h5 class="card-title">ZIP</h5>
                    <input required type="text" className="form-control" onChange={(e) => setZip(e.target.value)}></input>
                    <p class="card-text">Please enter your ZIP code: {zip}</p>
                    <button class="btn btn-primary" onClick={updateStreetAddress}>Update Address</button>
                </div>
            );
        }
    };

    const displayDOB = () => {
        if (user?.email && studentData && (studentData[0].dob !== undefined && studentData[0].dob !== "")) {
            return (
                <div>
                    <div>{studentData[0].dob}</div>
                    <button class="btn btn-primary" onClick={clearDOB}>Clear DOB</button>
                </div>
            );
        } else {
            return (
                <div>
                    <input required type="date" className="form-control" onChange={(e) => setDOB(e.target.value)}></input>
                    <p class="card-text">Input your date of birth: {dob}</p>
                    <button class="btn btn-primary" onClick={updateDOB}>Update DOB</button>
                </div>
            );
        }
    };

    const updateStreetAddress = async () => {
        const studentDoc = doc(db, "students", studentData[0].id);
        if (location !== "" && USState !== "" && city !== "" && zip !== "") {
            await updateDoc(studentDoc, {street_add: location});
            await updateDoc(studentDoc, {state: USState});
            await updateDoc(studentDoc, {city: city});
            await updateDoc(studentDoc, {zip: Number(zip)});
        }
    };

    const updateDOB = async () => {
        const studentDoc = doc(db, "students", studentData[0].id);
        if (dob !== "") {
            await updateDoc(studentDoc, {dob: dob});
        }
    }

    const clearAddress = async () => {
        const studentDoc = doc(db, "students", studentData[0].id);
        await updateDoc(studentDoc, {street_add: ""});
        await updateDoc(studentDoc, {state: ""});
        await updateDoc(studentDoc, {city: ""});
        await updateDoc(studentDoc, {zip: ""});

        setLocation("");
        setUSState("");
        setCity("");
        setZip("");
    }

    const clearDOB = async () => {
        const studentDoc = doc(db, "students", studentData[0].id);
        await updateDoc(studentDoc, {dob: ""});
    }

    
    return (
        
        <div class="row row-cols-1 row-cols-md-2 g-4">
            <div class="col">
                <div class="card">
                    <img src={userImage} class="card-img-top" alt="..."></img>
                    <input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg" onChange={(e) => setUserImage(e.target.value)}></input>
                    <div class="card-body">
                        <h5 class="card-title">Bio</h5>
                        {user?.email}
                        <div class="mb-3 fields">
                            <textarea class="form-control" id="exampleFormControlTextarea1" rows="5" name="issue"></textarea>
                        </div>
                        <p class="card-text">Tell us a little more about yourself. {bio}</p>
                        <button class="btn btn-primary" onSubmit={() => setBio("...")}>Edit</button>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Street Address</h5>
                        {displayStreetAddress()}
                        <h5 class="card-title">Date of Birth</h5>
                        {displayDOB()}
                        <h5 class="card-title">University</h5>
                        <select class="form-select" aria-label="Default select example" onChange={(e) => setUniversity(e.target.value)}>
                            <option selected>Please select your university</option>
                            <option value="Hunter College">Hunter College</option>
                            <option value="Baruch College">Baruch College</option>
                            <option value="Lehman College">Lehman College</option>
                        </select>
                        <p class="card-text">Please let us know what university you go to: {university}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<StudentProfilePage />);
export default StudentProfilePage;
