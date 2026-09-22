import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import configJson from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: configJson.apiKey,
  authDomain: configJson.authDomain,
  projectId: configJson.projectId,
  storageBucket: configJson.storageBucket,
  messagingSenderId: configJson.messagingSenderId,
  appId: configJson.appId
};

// Initialize Firebase App singleton
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app, configJson.firestoreDatabaseId || undefined);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
};
export type { FirebaseUser };
