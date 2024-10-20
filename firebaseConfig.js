// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import  { getReactNativePersistence , initializeAuth } from 'firebase/auth'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBvzSma5ny4dSV02ohNUp9gz3Cs0cfeP6I",
  authDomain: "chatapp-b03bc.firebaseapp.com",
  projectId: "chatapp-b03bc",
  storageBucket: "chatapp-b03bc.appspot.com",
  messagingSenderId: "632074457340",
  appId: "1:632074457340:web:915b739d240eeda883c779",
  measurementId: "G-QED6HVEM42"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
    persistence : getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);

export const usersRef = collection(db, 'users');
export const roomsRef = collection(db, 'rooms');