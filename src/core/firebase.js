// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"
import "firebase/compat/auth"
import "firebase/auth"
import "firebase/storage"
import "firebase/analytics"
import "firebase/performance"
import { getAuth} from "firebase/auth"
import { getStorage } from "firebase/storage"
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDpUMYNNoIc_AqJBmt1MMBwhOdrADC6HI8",
  authDomain: "test-3c6cb.firebaseapp.com",
  databaseURL: "https://test-3c6cb-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "test-3c6cb",
  storageBucket: "test-3c6cb.appspot.com",
  messagingSenderId: "761778131130",
  appId: "1:761778131130:web:aabc40ceaeef31180bb283",
  measurementId: "G-KS77FEEL50"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getDatabase(app)
const storage = getStorage(app)
const fireStore = getFirestore(app)

export {app, auth, db, storage, fireStore}