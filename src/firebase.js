import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseApp = {
    apiKey: "AIzaSyDIoZIvKqn5XZqiPJDIMpdjXRNNUqN4Y_0",
    authDomain: "instagram-clone-react-8b4e7.firebaseapp.com",
    projectId: "instagram-clone-react-8b4e7",
    storageBucket: "instagram-clone-react-8b4e7.appspot.com",
    messagingSenderId: "209295742960",
    appId: "1:209295742960:web:7aaf6cd9e206dfa675ef35",
    measurementId: "G-VQW52GBN90"
};

const app = initializeApp(firebaseApp);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);


export { app, db, auth, storage }
export const serverStamp = firebase.firestore.Timestamp