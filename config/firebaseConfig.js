// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration (Make sure this matches Firebase Console)
const firebaseConfig = {

};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Database
const auth = getAuth(app);
const database = getDatabase(app);

export { app, auth, database };
