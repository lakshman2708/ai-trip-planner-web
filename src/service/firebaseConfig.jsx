// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC6XiFmXk9iAhML_oAh91toeR225MIjTEo",
  authDomain: "ai-travel-planner-3558d.firebaseapp.com",
  projectId: "ai-travel-planner-3558d",
  storageBucket: "ai-travel-planner-3558d.firebasestorage.app",
  messagingSenderId: "420941054499",
  appId: "1:420941054499:web:5a9895308dc02cc7fea796",
  measurementId: "G-3KX37NW6Y3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

//const analytics = getAnalytics(app);