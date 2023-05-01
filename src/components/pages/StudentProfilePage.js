import { collection, doc, onSnapshot, query, updateDoc, where, getDocs, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase-config";
import { storage } from '../../firebase-config';
import { useUserSelector } from "../../services/selectors";
import { ref, uploadBytes, listAll, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';

const StudentProfilePage = () => {
  const user = useUserSelector();
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
 
  const imageListRef = ref(storage, "/profile_photos")
  useEffect(() => {
    console.log("in");
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
          setLocation(data[0].street_add);
          setDOB(data[0].dob);
          setUniversityID(data[0].university);
          setBio(data[0].bio);
        }
      });

      return () => {
        unsubscribe();
      };
    }

    
  }, [user]);

  useEffect(() => {
    listAll(imageListRef).then((response) => {
      response.items.forEach((item) => {
        if(`profile_photos/${item.name}` === studentData[0].profile_photo) {
          getDownloadURL(item).then((url) => {
            setUserImage(url);
          })
        }
      })
    });
  }, [imageListRef, studentData]);

  const uploadImage = async () => {
    if(imageUpload == null) return;
    const imageName = `profile_photos/${imageUpload.name + v4()}`;

    const imageRef = ref(storage, imageName)

    uploadBytes(imageRef, imageUpload).then(() => {
      alert("Image Uploaded");
    });

    const studentDoc = doc(db, "students", studentData[0].id);
    await updateDoc(studentDoc, { profile_photo: imageName });
  };

  const displayBio = () => {
    if (user?.email && studentData && studentData[0].bio !== undefined && studentData[0].bio !== "") {
      return (
        <div>
          <div>{studentData[0].bio}</div>
          <button class="btn btn-primary" onClick={clearBio}>
            Clear Bio
          </button>
        </div>
      );
    } else {
      return (
        <div>
          <div className="mb-3 fields">
              <textarea className="form-control" id="exampleFormControlTextarea1" rows="5" name="issue" onChange={(e) => setBio(e.target.value)}></textarea>
          </div>
          <button class="btn btn-primary" onClick={updateBio}>
            Update Bio
          </button>
        </div>
      );
    }
  };

  const updateBio = async () => {
    const studentDoc = doc(db, "students", studentData[0].id);
    if (bio !== "") {
      await updateDoc(studentDoc, { bio: bio });
    }
  };

  const clearBio = async () => {
    const studentDoc = doc(db, "students", studentData[0].id);
    await updateDoc(studentDoc, { bio: "" });
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
    await updateDoc(studentDoc, { profile_photo: "" });
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
    if (
      user?.email &&
      studentData &&
      studentData[0].street_add !== undefined &&
      studentData[0].street_add !== "" &&
      studentData[0].state !== undefined &&
      studentData[0].state !== "" &&
      studentData[0].state !== undefined &&
      studentData[0].state !== "" &&
      studentData[0].city !== undefined &&
      studentData[0].city !== "" &&
      studentData[0].zip !== undefined &&
      studentData[0].zip !== ""
    ) {
      return (
        <div>
          <div>{studentData[0].street_add}</div>
          <div>{studentData[0].city}</div>
          <div>{studentData[0].state}</div>
          <div>{studentData[0].zip}</div>
          <button class="btn btn-primary" onClick={clearAddress}>
            Clear Address
          </button>
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
          <button class="btn btn-primary" onClick={updateStreetAddress}>
            Update Address
          </button>
        </div>
      );
    }
  };

  const displayDOB = () => {
    if (user?.email && studentData && studentData[0].dob !== undefined && studentData[0].dob !== "") {
      return (
        <div>
          <div>{studentData[0].dob}</div>
          <button class="btn btn-primary" onClick={clearDOB}>
            Clear DOB
          </button>
        </div>
      );
    } else {
      return (
        <div>
          <input required type="date" className="form-control" onChange={(e) => setDOB(e.target.value)}></input>
          <p class="card-text">Input your date of birth: {dob}</p>
          <button class="btn btn-primary" onClick={updateDOB}>
            Update DOB
          </button>
        </div>
      );
    }
  };

  const updateStreetAddress = async () => {
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
  };

  const updateDOB = async () => {
    const studentDoc = doc(db, "students", studentData[0].id);
    if (dob !== "") {
      await updateDoc(studentDoc, { dob: dob });
    }
  };

  const clearDOB = async () => {
    const studentDoc = doc(db, "students", studentData[0].id);
    await updateDoc(studentDoc, { dob: "" });
  };

  const setSelectedUniversity = (id, name) => {
    setUniversityID(id);
    setUniversity(name);
  };
  
  const displayUniversity = () => {
    if (
      user?.email &&
      studentData &&
      studentData[0].university !== undefined &&
      studentData[0].university !== "" 
    ) {
      return (
        <div>
          <div>{university}</div>
          <button class="btn btn-primary" onClick={clearUniversity}>
            Clear University
          </button>
        </div>
      );
    } else {
      return (
        <div>
          <select className="form-select" aria-label="Default select example" onChange={(e) => {
            const selectedSchool = schoolsList.find((school) => school.id === e.target.value);
            setSelectedUniversity(selectedSchool.id, selectedSchool.name);
          }}>
              <option selected>Please select your university</option>
              {schoolsList.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
          </select>
          <p className="card-text">Please let us know what university you go to: {university}</p>
          <button class="btn btn-primary" onClick={updateUniversity}>
            Update University
          </button>
        </div>
      )
      
    }
  };

  const updateUniversity = async () => {
    const studentDoc = doc(db, "students", studentData[0].id);
    if (university !== "") {
      await updateDoc(studentDoc, { university:  universityID });
    }
  };

  const clearUniversity = async () => {
    const studentDoc = doc(db, "students", studentData[0].id);
    await updateDoc(studentDoc, { university: "" });
  };
  

  return (
    <div className="row row-cols-1 row-cols-md-2 g-4">
      <div className="col">
        <div className="card">
          {displayImage()}
          <div className="card-body">
            <h5 className="card-title">Bio</h5>
            <p className="card-text">Tell us a little more about yourself.</p>
            {user?.email}
            {displayBio()}
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
            <h5 className="card-title">Date of Birth</h5>
            {displayDOB()}
            <h5 className="card-title">University</h5>
            {displayUniversity()}
            <a href="/ParentProfilePage" class="btn btn-primary" role="button">
              Switch to Parent
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;