// Import only the needed functions from each service
import { initializeApp, FirebaseOptions } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { Analytics, getAnalytics, isSupported } from "firebase/analytics";
import { toast } from 'sonner';

const firebaseConfig: FirebaseOptions = {
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

// Initialize services lazily using a singleton pattern
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;
let _analytics: Analytics | null = null;

// Lazy initialization functions
export const auth = () => {
  if (!_auth) {
    _auth = getAuth(app);
  }
  return _auth;
};

export const db = () => {
  if (!_db) {
    _db = getFirestore(app);
  }
  return _db;
};

export const storage = () => {
  if (!_storage) {
    try {
      _storage = getStorage(app);
    } catch (error) {
      console.warn('Firebase Storage initialization failed:', error);
    }
  }
  return _storage;
};

export const analytics = async () => {
  if (!_analytics) {
    try {
      if (await isSupported()) {
        _analytics = getAnalytics(app);
      }
    } catch (error) {
      console.warn('Firebase Analytics initialization failed:', error);
    }
  }
  return _analytics;
};

// Error handling utility with specific error messages
export function handleFirestoreError(error: any) {
  console.error('Firestore error:', error);

  const errorMessages = {
    'permission-denied': 'You do not have permission to perform this action',
    'unavailable': 'Service is currently unavailable. Please try again later',
    'not-found': 'The requested resource was not found',
    'already-exists': 'This resource already exists',
    'unauthenticated': 'Please sign in to continue',
    'resource-exhausted': 'Request quota has been exceeded. Please try again later',
    'failed-precondition': 'Operation was rejected due to the current system state',
    'cancelled': 'Operation was cancelled',
    'data-loss': 'Unrecoverable data loss or corruption',
    'unknown': 'An unknown error occurred',
    'invalid-argument': 'Invalid argument provided',
    'deadline-exceeded': 'Deadline expired before operation could complete',
    'aborted': 'Operation was aborted'
  };

  const message = errorMessages[error.code as keyof typeof errorMessages] || 'An error occurred. Please try again';
  toast.error(message);
}

// User profile management with improved error handling and types
interface UserProfile {
  uid: string;
  email: string;
  role: string;
  name: string;
  createdAt: number;
}

export const createUserProfile = async (uid: string, email: string, role: string, name: string): Promise<UserProfile> => {
  try {
    const userProfile: UserProfile = {
      uid,
      email,
      role,
      name,
      createdAt: Date.now()
    };

    const firestore = db();
    await setDoc(doc(firestore, 'users', uid), userProfile);
    return userProfile;
  } catch (error) {
    console.error('Error creating user profile:', error);
    handleFirestoreError(error);
    throw error;
  }
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const firestore = db();
    const docRef = doc(firestore, 'users', uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as UserProfile : null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    handleFirestoreError(error);
    throw error;
  }
};

// Storage utility function
export const isStorageAvailable = (): boolean => {
  return storage() !== null;
};
