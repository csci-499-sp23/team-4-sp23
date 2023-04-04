import React, { useState } from 'react';


const StudentProfilePage = () => {
    const [bio, setBio] = useState("");
    const [location, setLocation] = useState("");
    const [age, setAge] = useState("");
    const [university, setUniversity] = useState("");
    const [userImage, setUserImage] = useState("...");

    return (
        <div class="row row-cols-1 row-cols-md-2 g-4">
            <div class="col">
                <div class="card">
                    <img src={userImage} class="card-img-top" alt="..."></img>
                    <div class="card-body">
                        <h5 class="card-title">Bio</h5>
                        <div class="mb-3 fields">
                            <textarea class="form-control" id="exampleFormControlTextarea1" rows="5" name="issue"></textarea>
                        </div>
                        <p class="card-text">Tell us a little more about yourself.</p>
                        <a class="btn btn-primary" href="/StudentProfilePage" role="button" onSubmit={() => setUserImage("...")}>Edit</a>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="card">
                    <img src="..." class="card-img-top" alt="..."></img>
                    <div class="card-body">
                        <h5 class="card-title">University</h5>
                        <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="card">
                    <img src="..." class="card-img-top" alt="..."></img>
                    <div class="card-body">
                        <h5 class="card-title">Age</h5>
                        <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content.</p>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="card">
                    <img src="..." class="card-img-top" alt="..."></img>
                    <div class="card-body">
                        <h5 class="card-title">Location</h5>
                        <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default StudentProfilePage;