import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB166r_T5-8aDzDuy8gi8MVSRARovVfH1o",
  authDomain: "adcs-presenca-jiu-jitsu.firebaseapp.com",
  projectId: "adcs-presenca-jiu-jitsu",
  storageBucket: "adcs-presenca-jiu-jitsu.firebasestorage.app",
  messagingSenderId: "49159692549",
  appId: "1:49159692549:web:19df22d3a556f0aaaad76c"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export { firebaseApp, db };