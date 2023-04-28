import { initializeApp } from "@firebase/app";
import { getAuth } from "@firebase/auth";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage";

//import cors from 'cors';

//for cloud functions
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";

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
  measurementId: "G-EXXC62JZHE",
};

const app = initializeApp(firebaseConfig);

// const corsOptions = {
//   origin: '*',
// };

// firebase.initializeApp(firebaseConfig, {
//   cors: corsOptions,
// });

//make functions,auth,db available in frontent
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);

//setup for local development
const NODE_ENV = process.env.NODE_ENV;

if (NODE_ENV === "development") {
  const API_PORT = process.env.REACT_APP_API_PORT ?? 4000;

  console.log("%c running firebase local emulator: %O", "background:blue;color:white", { NODE_ENV, PORT: API_PORT });
  connectFunctionsEmulator(functions, "localhost", API_PORT);
}
