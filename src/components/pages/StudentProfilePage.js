import React, { useState } from 'react';
import ReactDOM from "react-dom/client";

const StudentProfilePage = () => {
    const [bio, setBio] = useState("");
    const [location, setLocation] = useState("");
    const [age, setAge] = useState("");
    const [university, setUniversity] = useState("");
    const [userImage, setUserImage] = useState("https://media.istockphoto.com/id/517188688/photo/mountain-landscape.jpg?s=612x612&w=0&k=20&c=A63koPKaCyIwQWOTFBRWXj_PwCrR4cEoOw2S9Q7yVl8=");
    const [traits, setTraits] = useState("");

    return (
        <div class="row row-cols-1 row-cols-md-2 g-4">
            <div class="col">
                <div class="card">
                    <img src={userImage} class="card-img-top" alt="..."></img>
                    <input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg" onChange={(e) => setUserImage(e.target.value)}></input>
                    <div class="card-body">
                        <h5 class="card-title">Bio</h5>
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
                        <h5 class="card-title">Location</h5>
                        <input required type="text" className="form-control" onChange={(e) => setLocation(e.target.value)}></input>
                        <p class="card-text">Please input your current location: {location}</p>
                        <h5 class="card-title">University</h5>
                        <select class="form-select" aria-label="Default select example" onChange={(e) => setUniversity(e.target.value)}>
                            <option selected>Open this select menu</option>
                            <option value="Hunter College">Hunter College</option>
                            <option value="Baruch College">Baruch College</option>
                            <option value="Lehman College">Lehman College</option>
                        </select>
                        <p class="card-text">Please let us know what university you go to. {university}</p>
                        <h5 class="card-title">Age</h5>
                        <input required type="text" className="form-control" onChange={(e) => setAge(e.target.value)}></input>
                        <p class="card-text">Input your age: {age}</p>
                        <h5 class="card-title">Traits</h5>
                        <div class="mb-3 fields">
                            <textarea class="form-control" id="exampleFormControlTextarea1" rows="5" name="issue" onChange={(e) => setTraits(e.target.value)}></textarea>
                        </div>
                        <p class="card-text">Finally, let us know what defines you as you. {traits}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<StudentProfilePage />);
export default StudentProfilePage;