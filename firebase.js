// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDY__rJRjZMZiMKWniz0IyFiMfR65OpCxs",
  authDomain: "learningmanagement-deb78.firebaseapp.com",
  databaseURL: "https://learningmanagement-deb78-default-rtdb.firebaseio.com",
  projectId: "learningmanagement-deb78",
  storageBucket: "learningmanagement-deb78.appspot.com",
  messagingSenderId: "708241782225",
  appId: "1:708241782225:web:0ba3cb09da067a57999cf0",
  measurementId: "G-2QT0364P98"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth()

export { auth };

