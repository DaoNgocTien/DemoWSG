import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

import firebaseConfig from "./serviceAccountKey.json";
// firebase.initializeApp(config);
const app = initializeApp(firebaseConfig);
export const realtime = getDatabase(app);
export const db = getFirestore(app)
