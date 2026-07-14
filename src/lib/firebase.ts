import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDq61klLq0d1zLls6wy5hB428ikQFsLlLc",
  authDomain: "laex-4ceb2.firebaseapp.com",
  projectId: "laex-4ceb2",
  storageBucket: "laex-4ceb2.firebasestorage.app",
  messagingSenderId: "699985491971",
  appId: "1:699985491971:web:f994bfcc5e7bb320f17636",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export default app;