import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBBUdX7ng6OWc2Rl3Gee46Eyl-_JHNQXlA",
    authDomain: "prepwiseapp.firebaseapp.com",
    projectId: "prepwiseapp",
    storageBucket: "prepwiseapp.firebasestorage.app",
    messagingSenderId: "705381730366",
    appId: "1:705381730366:web:60c5f59c9f3f155d09a96f",
    measurementId: "G-0HQQQ88TFJ"
  };

  if(firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
  }

  export {firebase};