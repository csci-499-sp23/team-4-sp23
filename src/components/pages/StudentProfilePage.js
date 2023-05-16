import { collection, doc, onSnapshot, query, updateDoc, where, getDocs, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase-config";
import { storage } from '../../firebase-config';
import { useUserSelector } from "../../services/selectors";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCheckCircle } from '@fortawesome/fontawesome-free-solid'

const StudentProfilePage = () => {
  const user = useUserSelector();
  const [firstName, setFirstName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [USState, setUSState] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [dob, setDOB] = useState("");
  const [universityID, setUniversityID] = useState("");
  const [university, setUniversity] = useState("");
  const [schoolsList, setSchoolsList] = useState([]);
  const [userImage, setUserImage] = useState("https://media.istockphoto.com/id/517188688/photo/mountain-landscape.jpg?s=612x612&w=0&k=20&c=A63koPKaCyIwQWOTFBRWXj_PwCrR4cEoOw2S9Q7yVl8=");
  const [studentData, setStudentData] = useState(null);
  const [imageUpload, setImageUpload] = useState(null);
  const [editBio, setEditBio] = useState(false);
  const [editAddress, setEditAddress] = useState(false);
  const [editDOB, setEditDOB] = useState(false);
  const [editUniversity, setEditUniversity] = useState(false);
 
  useEffect(() => {
    const fetchSchools = async () => {
      const schoolsRef = collection(db, "schools");
      try {
        const data = await getDocs(schoolsRef);
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(), id: doc.id
        }));
        setSchoolsList(filteredData);
      } catch(err) {
        console.error(err);
      }
      
    };
    
    fetchSchools();
  }, []);

  useEffect(() => {
    if (user?.email) {
      const studentRef = query(collection(db, "students"), where("email", "==", user.email));
      

      const unsubscribe = onSnapshot(studentRef, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setStudentData(data);
        if (data.length > 0) {
          setFirstName(data[0].first_name);
          setLocation(data[0].street_add);
          setCity(data[0].city);
          setZip(data[0].zip);
          setUSState(data[0].state);
          setDOB(data[0].dob);
          setUniversityID(data[0].school_id);
          setBio(data[0].bio);
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, [user]);

  useEffect(() => {
    const fetchImage = async () => {
      if (studentData && studentData[0]?.image) {
        try {
          setUserImage(studentData[0].image);
        } catch (error) {
          console.error("Error fetching image: ", error);
        }
      }
    };
  
    fetchImage();
  }, [studentData]);

  const uploadImage = async () => {
    if(imageUpload == null) return;
    const imageName = `profile_photos/${imageUpload.name + v4()}`;
  
    const imageRef = ref(storage, imageName)
  
    uploadBytes(imageRef, imageUpload).then(async () => {
      const url = await getDownloadURL(imageRef);
      
      const studentDoc = doc(db, "students", studentData[0].id);
      
      await updateDoc(studentDoc, { image: url });
  
      alert("Image Uploaded");
    });
  };

  
  const displayBio = () => {
    if (editBio) {
      return (
        <div className="d-flex flex-column">
          <textarea className="form-control mb-3" id="exampleFormControlTextarea1" rows="5" name="issue" value={bio} onChange={(e) => setBio(e.target.value)}></textarea>
          <div className="d-flex justify-content-end">
            <p className="x-clear" onClick={clearBio}><strong>X</strong></p>
            <div className="icon-wrapper" onClick={updateBio}>
              <FontAwesomeIcon
                className="icon-pointer"
                icon={faCheckCircle}
                size="lg"
                style={{ color: "#38ab07", cursor: "pointer" }}
              />
            </div>
          </div>
        </div>
      );
    } else if (user?.email && studentData && studentData[0].bio !== undefined && studentData[0].bio !== "") {
      return (
        <div className="d-flex flex-column">
          <div className="bio-text">{studentData[0].bio}</div>
          <div className="d-flex justify-content-end">
            <div className="icon-wrapper" onClick={() => setEditBio(true)}>
              <FontAwesomeIcon
                className="icon-pointer"
                icon={faEdit}
                size="lg"
                style={{ color: "#2685df", cursor: "pointer" }}
              />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="d-flex flex-column">
          <p className="card-text">Tell us a little more about yourself.</p>
          <textarea className="form-control mb-3" id="exampleFormControlTextarea1" rows="5" name="issue" value={bio} onChange={(e) => setBio(e.target.value)}></textarea>
          <div className="d-flex justify-content-end">
            <div className="icon-wrapper" onClick={updateBio}>
              <FontAwesomeIcon
                className="icon-pointer"
                icon={faCheckCircle}
                size="lg"
                style={{ color: "#38ab07", cursor: "pointer" }}
              />
            </div>
          </div>
        </div>
      );
    }
  };

  const updateBio = async () => {
    setEditBio(false);
    const studentDoc = doc(db, "students", studentData[0].id);
    if (bio !== "") {
      await updateDoc(studentDoc, { bio: bio });
    }
  };

  const clearBio = async () => {
    const studentDoc = doc(db, "students", studentData[0].id);
    await updateDoc(studentDoc, { bio: "" });
    setEditBio(false);
  };

  const displayImage = () => {
    if(
      userImage === "https://media.istockphoto.com/id/517188688/photo/mountain-landscape.jpg?s=612x612&w=0&k=20&c=A63koPKaCyIwQWOTFBRWXj_PwCrR4cEoOw2S9Q7yVl8=" ||
      userImage === ""
    ) {
      return (
        <div>
            <img src={userImage} className="card-img-top" alt="..."></img>
            <input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg" onChange={(event) => {setImageUpload(event.target.files[0])}}></input>
            <button onClick={uploadImage}> Upload Image</button>
        </div>
      )
    } else {
      return (
        <div>
          <img src={userImage} className="card-img-top" alt="..."></img>
          <button onClick={clearImage}> Clear Image</button>
        </div>
      )
    }
  };

  const clearImage = async () => {
    const studentDoc = doc(db, "students", studentData[0].id);
    await updateDoc(studentDoc, { image: "" });
    setUserImage("https://media.istockphoto.com/id/517188688/photo/mountain-landscape.jpg?s=612x612&w=0&k=20&c=A63koPKaCyIwQWOTFBRWXj_PwCrR4cEoOw2S9Q7yVl8=");
  };

  const fetchUniversityName = async (universityID) => {
    if (universityID) {
      try {
        const universityDocRef = doc(db, "schools", universityID);
        const universityDoc = await getDoc(universityDocRef);

        const universityName = universityDoc.data().name;
        setUniversity(universityName);
      } catch (err) {
        console.error(err);
      }
    } else {
      setUniversity("");
    }
  };
  
  useEffect(() => {
    fetchUniversityName(universityID);
  }, [universityID]);

  
  const displayStreetAddress = () => {
    if (editAddress) {
      return (
        <div className="d-flex flex-column">
          <label>Street Address</label>
          <input
            required
            type="text"
            className="form-control input-field mb-3"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          ></input>
          <label>State</label>
          <select
            className="form-select input-field mb-3"
            value={USState}
            onChange={(e) => setUSState(e.target.value)}
          >
            <option selected>Please select your state</option>
            <option value="MA">MA</option>
            <option value="NJ">NJ</option>
            <option value="NY">NY</option>
          </select>
          <label>City</label>
          <input
            required
            type="text"
            className="form-control input-field mb-3"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          ></input>
          <label>ZIP</label>
          <input
            required
            type="text"
            className="form-control input-field mb-3"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
          ></input>
          <div className="d-flex justify-content-end">
            <p className="x-clear" onClick={clearAddress}><strong>X</strong></p>
            <div className="icon-wrapper" onClick={updateStreetAddress}>
              <FontAwesomeIcon
                className="icon-pointer"
                icon={faCheckCircle}
                size="lg"
                style={{ color: "#38ab07", cursor: "pointer" }}
              />
            </div>
            
          </div>
        </div>
      );
    } else if (
      user?.email &&
      studentData &&
      studentData[0].street_add !== undefined &&
      studentData[0].street_add !== "" &&
      studentData[0].state !== undefined &&
      studentData[0].state !== "" &&
      studentData[0].city !== undefined &&
      studentData[0].city !== "" &&
      studentData[0].zip !== undefined &&
      studentData[0].zip !== ""
    ) {
      return (
        <div className="d-flex flex-column">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>{studentData[0].street_add}</div>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>{studentData[0].state}</div>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>{studentData[0].city}</div>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>{studentData[0].zip}</div>
          </div>
          <div className="d-flex justify-content-end">
            <div className="icon-wrapper" onClick={() => setEditAddress(true)}>
              <FontAwesomeIcon
                className="icon-pointer"
                icon={faEdit}
                size="lg"
                style={{ color: "#2685df", cursor: "pointer" }}
              />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="d-flex flex-column">
          <label>Street Address</label>
          <input required type="text" className="form-control input-field mb-3" onChange={(e) => setLocation(e.target.value)}></input>
          <label>State</label>
          <select class="form-select input-field mb-3" onChange={(e) => setUSState(e.target.value)}>
            <option selected>Please select your state</option>
            <option value="MA">MA</option>
            <option value="NJ">NJ</option>
            <option value="NY">NY</option>
          </select>
          <label>City</label>
          <input required type="text" className="form-control input-field mb-3" onChange={(e) => setCity(e.target.value)}></input>
          <label>ZIP</label>
          <input required type="text" className="form-control input-field mb-3" onChange={(e) => setZip(e.target.value)}></input>
          <div className="d-flex justify-content-end">
            <div className="icon-wrapper" onClick={updateStreetAddress}>
              <FontAwesomeIcon
                className="icon-pointer"
                icon={faCheckCircle}
                size="lg"
                style={{ color: "#38ab07", cursor: "pointer" }}
              />
            </div>
          </div>
        </div>
      );
    }
  };
  
  

  const displayDOB = () => {
    if (editDOB) {
      return (
        <div className="d-flex flex-column">
          <input 
            required 
            type="date" 
            className="form-control input-field" 
            value={dob}
            onChange={(e) => setDOB(e.target.value)}
          ></input>
          <div className="d-flex justify-content-end">
            <p className="x-clear" onClick={clearDOB}><strong>X</strong></p>
            <div className="icon-wrapper" onClick={() => {updateDOB()}}>
              <FontAwesomeIcon
                className="icon-pointer"
                icon={faCheckCircle}
                size="lg"
                style={{ color: "#38ab07", cursor: "pointer" }}
              />
            </div>
          </div>
        </div>
      );
    } else if (user?.email && studentData && studentData[0].dob !== undefined && studentData[0].dob !== "") {
      return (
        <div className="d-flex flex-column">
          <div>{studentData[0].dob}</div>
          <div className="d-flex justify-content-end">
          
            <div className="icon-wrapper" onClick={() => setEditDOB(true)}>
              <FontAwesomeIcon
                className="icon-pointer"
                icon={faEdit}
                size="lg"
                style={{ color: "#2685df", cursor: "pointer" }}
              />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="d-flex flex-column">
          <input required type="date" className="form-control input-field" onChange={(e) => setDOB(e.target.value)}></input>
          <div className="icon-wrapper" onClick={updateDOB}>
            <div className="d-flex justify-content-end">
              <FontAwesomeIcon
                className="icon-pointer"
                icon={faCheckCircle}
                size="lg"
                style={{ color: "#38ab07", cursor: "pointer" }}
              />
            </div>
          </div>
        </div>
      );
    }
  };
  

  const updateStreetAddress = async () => {
    setEditAddress(false);
    const studentDoc = doc(db, "students", studentData[0].id);
    if (location !== "" && USState !== "" && city !== "" && zip !== "") {
      await updateDoc(studentDoc, { street_add: location });
      await updateDoc(studentDoc, { state: USState });
      await updateDoc(studentDoc, { city: city });
      await updateDoc(studentDoc, { zip: Number(zip) });
    }
  };

  const clearAddress = async () => {
    const studentDoc = doc(db, "students", studentData[0].id);
    await updateDoc(studentDoc, { street_add: "" });
    await updateDoc(studentDoc, { state: "" });
    await updateDoc(studentDoc, { city: "" });
    await updateDoc(studentDoc, { zip: "" });

    setLocation("");
    setUSState("");
    setCity("");
    setZip("");
    setEditAddress(false);
  };

  const updateDOB = async () => {
    setEditDOB(false);
    const studentDoc = doc(db, "students", studentData[0].id);
    if (dob !== "") {
      await updateDoc(studentDoc, { dob: dob });
    }
  };

  const clearDOB = async () => {
    const studentDoc = doc(db, "students", studentData[0].id);
    await updateDoc(studentDoc, { dob: "" });
    setEditDOB(false);
  };

  const setSelectedUniversity = (id, name) => {
    setUniversityID(id);
    setUniversity(name);
  };
  
  const displayUniversity = () => {
    if (editUniversity) {
      return (
        <div className="d-flex flex-column">
          <div className="position-relative">
            <div className="university-wrapper">
              <select
                className="form-select input-field"
                value={universityID} 
                onChange={(e) => {
                  const selectedSchool = schoolsList.find((school) => school.id === e.target.value);
                  setSelectedUniversity(selectedSchool.id, selectedSchool.name);
                }}
              >
                <option>Please select your university</option>
                {schoolsList.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))}
              </select>
              <div className="d-flex justify-content-end">
                <p className="x-clear" onClick={clearUniversity}><strong>X</strong></p>
                <div className="edit-icon-wrapper" onClick={() => {updateUniversity()}}>
                  <FontAwesomeIcon
                    className="icon-pointer"
                    icon={faCheckCircle}
                    size="lg"
                    style={{ color: "#38ab07", cursor: "pointer" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (
      user?.email &&
      studentData &&
      studentData[0].university !== undefined &&
      studentData[0].university !== ""
    ) {
      return (
        <div className="d-flex flex-column">
          <div>{university}</div>
          <div className="d-flex justify-content-end">
            <div className="icon-wrapper" onClick={() => setEditUniversity(true)}>
              <FontAwesomeIcon
                className="icon-pointer"
                icon={faEdit}
                size="lg"
                style={{ color: "#2685df", cursor: "pointer" }}
              />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="d-flex flex-column">
          <div className="position-relative">
            <div className="university-wrapper">
              <select
                className="form-select input-field"
                onChange={(e) => {
                  const selectedSchool = schoolsList.find((school) => school.id === e.target.value);
                  setSelectedUniversity(selectedSchool.id, selectedSchool.name);
                }}
              >
                <option selected>Please select your university</option>
                {schoolsList.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))}
              </select>
              <div className="d-flex justify-content-end">
                <div className="edit-icon-wrapper" onClick={updateUniversity}>
                  <FontAwesomeIcon
                    className="icon-pointer"
                    icon={faCheckCircle}
                    size="lg"
                    style={{ color: "#38ab07", cursor: "pointer" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };  

  const updateUniversity = async () => {
    setEditUniversity(false);
    const studentDoc = doc(db, "students", studentData[0].id);
    if (university !== "") {
      await updateDoc(studentDoc, { school_id:  universityID });
    }
  };

  const clearUniversity = async () => {
    const studentDoc = doc(db, "students", studentData[0].id);
    await updateDoc(studentDoc, { school_id: "" });
  };
  

  return (
    <div className="row row-cols-1 row-cols-md-2 g-4">
      <div className="col">
        <div className="card">
          <h2>Hi, {firstName}!</h2>
          {displayImage()}
          <div className="card-body">
            <h5 className="card-title">Bio</h5>
            {displayBio()}
            <br></br>
            <div class="button-container">
                    <a href="/survey" class="btn btn-primary">Take Survey</a>
            </div>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Street Address</h5>
            {displayStreetAddress()}
            <br></br>
            <h5 className="card-title">Date of Birth</h5>
            {displayDOB()}
            <br></br>
            <h5 className="card-title">University</h5>
            {displayUniversity()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;