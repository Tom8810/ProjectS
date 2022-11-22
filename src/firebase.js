// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZuhcDP8jfoSJ_42vFW5NzRhKRCLWeTHo",
  authDomain: "project-s-39821.firebaseapp.com",
  projectId: "project-s-39821",
  storageBucket: "project-s-39821.appspot.com",
  messagingSenderId: "1032961623321",
  appId: "1:1032961623321:web:09ab5f007a576ab9d5b188",
  measurementId: "G-S9T6KC6Q87",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
