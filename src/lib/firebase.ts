import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAnalytics, isSupported } from "firebase/analytics";
import { getStorage } from 'firebase/storage';
import { toast } from 'sonner';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize core services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize optional services with error handling
let storageInstance = null;
try {
  storageInstance = getStorage(app);
} catch (error) {
  console.warn('Firebase Storage initialization failed:', error);
}
export const storage = storageInstance;

// Initialize analytics conditionally
export const analytics = (async () => {
  try {
    if (await isSupported()) {
      return getAnalytics(app);
    }
    return null;
  } catch (error) {
    console.warn('Firebase Analytics initialization failed:', error);
    return null;
  }
})();

// Error handling utility
export function handleFirestoreError(error: any) {
  console.error('Firestore error:', error);

  // Handle specific Firebase error codes
  switch (error.code) {
    case 'permission-denied':
      toast.error('You do not have permission to perform this action');
      break;
    case 'unavailable':
      toast.error('Service is currently unavailable. Please try again later');
      break;
    case 'not-found':
      toast.error('The requested resource was not found');
      break;
    case 'already-exists':
      toast.error('This resource already exists');
      break;
    case 'unauthenticated':
      toast.error('Please sign in to continue');
      break;
    default:
      toast.error('An error occurred. Please try again');
  }
}

// User profile management
export const createUserProfile = async (uid: string, email: string, role: string, name: string) => {
  try {
    const userProfile = {
      uid,
      email,
      role,
      name,
      createdAt: Date.now()
    };

    await setDoc(doc(db, 'users', uid), userProfile);
    return userProfile;
  } catch (error) {
    console.error('Error creating user profile:', error);
    handleFirestoreError(error);
    throw error;
  }
};

export const getUserProfile = async (uid: string) => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    handleFirestoreError(error);
    throw error;
  }
};

// Storage utility function
export const isStorageAvailable = () => {
  return storage !== null;
};
