import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBN9qQWRSIwwGkSoXyMdE68G5p0dEahx3s",
  authDomain: "testapp-25fb5.firebaseapp.com",
  projectId: "testapp-25fb5",
  storageBucket: "testapp-25fb5.appspot.com",
  messagingSenderId: "926800088408",
  appId: "1:926800088408:web:0f63e0f642c0f32466292d"
};

let firebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
}
export const firebaseAuth = getAuth(firebaseApp);
export const firebaseDB = getFirestore(firebaseApp);