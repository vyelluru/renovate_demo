// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBfT4vYW9HgTLuEJf3A1oF1FfT0fM-22EE",
  authDomain: "renovate-demo-aa0f9.firebaseapp.com",
  projectId: "renovate-demo-aa0f9",
  storageBucket: "renovate-demo-aa0f9.appspot.com",
  messagingSenderId: "252332969039",
  appId: "1:252332969039:web:937d24ad251c0a2c6aae3a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const googleAuthProvider = new GoogleAuthProvider();
export default app;