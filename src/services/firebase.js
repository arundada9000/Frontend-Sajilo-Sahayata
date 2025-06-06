// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCveGCKXLHD0TD-rTU5gtNQ6asjad2ITVc",
  authDomain: "sajilo-sahayata-otp.firebaseapp.com",
  projectId: "sajilo-sahayata-otp",
  storageBucket: "sajilo-sahayata-otp.firebasestorage.app",
  messagingSenderId: "399973886367",
  appId: "1:399973886367:web:05c6f676e2bf2c0c1175aa",
  measurementId: "G-VZNZLY9PGZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);