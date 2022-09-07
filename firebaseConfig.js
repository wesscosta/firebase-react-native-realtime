import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAPuDIoGr3KVLd1uBXRLAsFwErr7ZT09mw",
  authDomain: "realtimelocation-45737.firebaseapp.com",
  databaseURL: "https://realtimelocation-45737-default-rtdb.firebaseio.com",
  projectId: "realtimelocation-45737",
  storageBucket: "realtimelocation-45737.appspot.com",
  messagingSenderId: "752695329557",
  appId: "1:752695329557:web:53a46cdf2397383faa1f1c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

export { app as firebase, database };
