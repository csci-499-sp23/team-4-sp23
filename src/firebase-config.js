import { initializeApp } from "@firebase/app";
import { getFirestore } from "@firebase/firestore";

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_API_KEY,
//   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//   messagingSenderId:process.env.REACT_APP_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_APP_ID,
//   measurementId: process.env.REACT_APP_MEASUREMENT_ID
// };

const firebaseConfig = {
  apiKey: "AIzaSyCzABhmD4wXvZRuGVnQjeDg1trTfWLdVeA",
  authDomain: "wheel-call-you-9b6ca.firebaseapp.com",
  projectId: "wheel-call-you-9b6ca",
  storageBucket: "wheel-call-you-9b6ca.appspot.com",
  messagingSenderId: "701045750455",
  appId: "1:701045750455:web:5061846e1c71c39af1eb32",
  measurementId: "G-EXXC62JZHE"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore();