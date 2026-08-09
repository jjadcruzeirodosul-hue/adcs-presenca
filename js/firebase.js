import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
    firebaseConfig,
    firebaseEnvironment
} from "./firebase-config.js";

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

console.info(
    `[Firebase] Ambiente: ${firebaseEnvironment.name} | Projeto: ${firebaseEnvironment.projectId}`
);

export {
    firebaseApp,
    db,
    auth
};