// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
const firebaseConfig = {
  apiKey: 'AIzaSyB7ZKEjbcYt82lD6s-Z7It06qVlApUGOIk',
  authDomain: 'notes-tasks.firebaseapp.com',
  projectId: 'notes-tasks',
  storageBucket: 'notes-tasks.appspot.com',
  messagingSenderId: '688498168403',
  appId: '1:688498168403:web:32ee81951a8f8f1d442ca6',
  measurementId: 'G-C5ZTCYCNWZ',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
