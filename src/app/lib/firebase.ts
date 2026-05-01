import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBPV6p_63Oun8aBbstqHer2HfuwBxnC51k",
  authDomain: "binz-8bb2d.firebaseapp.com",
  projectId: "binz-8bb2d",
  storageBucket: "binz-8bb2d.firebasestorage.app",
  messagingSenderId: "621050316529",
  appId: "1:621050316529:web:e99f8149bd70246b148b50",
  measurementId: "G-0N20J4MD6D"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db   = getFirestore(app);
export const auth = getAuth(app);
export default app;
