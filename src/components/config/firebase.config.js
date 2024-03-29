// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDU9bDBBwg8kfJeSAx5YXFRxCQaC9N1frE",
  authDomain: "otp-zalo-d6833.firebaseapp.com",
  projectId: "otp-zalo-d6833",
  storageBucket: "otp-zalo-d6833.appspot.com",
  messagingSenderId: "32668031824",
  appId: "1:32668031824:web:3e90f2d08d08115c32ea55",
  measurementId: "G-6DJSHK3X4R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)