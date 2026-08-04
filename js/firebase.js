import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

import {
    firebaseConfig,
    firebaseEnvironment
} from "./firebase-config.js";

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

console.info(
    `[Firebase] Ambiente: ${firebaseEnvironment.name} | Projeto: ${firebaseEnvironment.projectId}`
);

export { firebaseApp, db };