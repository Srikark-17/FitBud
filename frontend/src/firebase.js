import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBpwfLnwKxQWfIGqXrMcWTM8FA06bA1E8c",
  authDomain: "fitbud-53457.firebaseapp.com",
  projectId: "fitbud-53457",
  storageBucket: "fitbud-53457.appspot.com",
  messagingSenderId: "967294387381",
  appId: "1:967294387381:web:b6d4f7cd9688aece30eafc",
};

const firebaseApp = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();
const db = firebaseApp.firestore();
const auth = firebase.auth();
export { db, auth };
