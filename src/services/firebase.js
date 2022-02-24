import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

import firebaseConfig from "./serviceAccountKey.json";
// firebase.initializeApp(config);
const app = initializeApp(firebaseConfig);
export const realtime = getDatabase(app);
