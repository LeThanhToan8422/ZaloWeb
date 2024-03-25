// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlndw0sayeE2zaQ-OmqzBELQk4Zl7K52s",
  authDomain: "zalo-5fa10.firebaseapp.com",
  projectId: "zalo-5fa10",
  storageBucket: "zalo-5fa10.appspot.com",
  messagingSenderId: "693277812939",
  appId: "1:693277812939:web:d50875c70561ba238d534e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
export default auth;
