import React, { useState } from 'react';


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
                    <input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg" onChange={() => setUserImage("...")}></input>
                    <div class="card-body">
                        <h5 class="card-title">Bio</h5>
                        <div class="mb-3 fields">
                            <textarea class="form-control" id="exampleFormControlTextarea1" rows="5" name="issue"></textarea>
                        </div>
                        <p class="card-text">Tell us a little more about yourself. {bio}</p>
                        <a class="btn btn-primary" role="button" onSubmit={() => setBio("...")}>Edit</a>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Location</h5>
                        <input required type="password" className="form-control" id="exampleInputPassword1" onSubmit={() => setLocation("...")}></input>
                        <p class="card-text">Please input your current location: {location}</p>
                        <h5 class="card-title">University</h5>
                        <input required type="password" className="form-control" id="exampleInputPassword1" onSubmit={() => setUniversity("...")}></input>
                        <p class="card-text">Please let us know what university you go to. {university}</p>
                        <h5 class="card-title">Age</h5>
                        <input required type="password" className="form-control" id="exampleInputPassword1" onSubmit={() => setAge("...")}></input>
                        <p class="card-text">Input your age: {age}</p>
                        <h5 class="card-title">Traits</h5>
                        <div class="mb-3 fields">
                            <textarea class="form-control" id="exampleFormControlTextarea1" rows="5" name="issue" onSubmit={() => setTraits("...")}></textarea>
                        </div>
                        <p class="card-text">Finally, let us know what defines you as you. {traits}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default StudentProfilePage;