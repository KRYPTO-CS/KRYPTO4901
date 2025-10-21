// from the firebase docs

/* 
Security Concerns:

Please note that these keys and identifiers are part of the Firebase configuration for a web application. 
They are not considered sensitive information, as they are necessary for the app to connect to Firebase services.
It is important to configure our Firebase security rules as time goes on to protect our database and storage from unauthorized access.

*/

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth, initializeAuth, type Auth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJ5Ftr3TNWIgC6UTWNqiJAz77iYBg2Hpg",
  authDomain: "krypto-project-e3a46.firebaseapp.com",
  databaseURL: "https://krypto-project-e3a46-default-rtdb.firebaseio.com",
  projectId: "krypto-project-e3a46",
  storageBucket: "krypto-project-e3a46.firebasestorage.app",
  messagingSenderId: "712787396331",
  appId: "1:712787396331:web:aea802e61ddad216f8e0ae",
  measurementId: "G-CFG3G1S89B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

let auth: Auth;
try {
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;

  let getRNPersistence: any = undefined;
  try {
    getRNPersistence = require('firebase/auth/react-native').getReactNativePersistence;
  } catch (e) {
    getRNPersistence = undefined;
  }

  if (AsyncStorage && getRNPersistence) {
    auth = initializeAuth(app, {
      persistence: getRNPersistence(AsyncStorage),
    });
  } else {
    auth = getAuth(app);
  }
} catch (e) {
  auth = getAuth(app);
}

export { auth };
export const db = getDatabase(app);
export const firestore = getFirestore(app);