import { useState } from "react";
import { storage } from "../../firebase-config";
import { auth } from '../../firebase-config';
import axios from "axios";


function VerifyLicense() {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setName(selectedFile.name);
      setError(null);
    } else {
      setFile(null);
      setName("");
      setError("Please select a file to upload.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
  
      // Make a POST request to the Persona API endpoint
      axios.post("PERSONA_API_ENDPOINT_URL", formData)
        .then((response) => {
          console.log("Verification successful:", response.data);
  
          // Update user profile with license verification status
          const currentUser = auth.currentUser;
          currentUser.updateProfile({
            licenseVerified: true
          })
          .then(() => {
            console.log("User profile updated with license verification status");
          })
          .catch((error) => {
            console.error("Error updating user profile:", error);
          });
        })
        .catch((error) => {
          console.error("Verification failed:", error);
        });
    } else {
      setError("Please select a file to upload.");
    }
  };
  
  return (
    <div>
      <h2>Verify Your Driver's License</h2>
      <p>Please upload a copy of your driver's license to verify your identity.</p>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="file" onChange={handleChange} />
          {error && <div className="error">{error}</div>}
        </div>
        <button type="submit" disabled={!file}>Upload</button>
        <p>{name}</p>
      </form>
    </div>
  );
}

export default VerifyLicense;
