import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth"; 

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "", 
  messagingSenderId: "",
  appId: ""
};

const app = initializeApp(firebaseConfig);

const db = getDatabase(app); 
const auth = getAuth(app); 

export { app, db, auth };