// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration (Make sure this matches Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyCQTLD6_sZyFcJFMYWEj4Lqc7UaEirso2g",
  authDomain: "mc-project-93236.firebaseapp.com",
  databaseURL: "https://mc-project-93236-default-rtdb.firebaseio.com",
  projectId: "mc-project-93236",
  storageBucket: "mc-project-93236.appspot.com", // Fixed incorrect domain
  messagingSenderId: "427069649425",
  appId: "1:427069649425:web:6178163e7509dd08f237b0"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Database
const auth = getAuth(app);
const database = getDatabase(app);

export { app, auth, database };
