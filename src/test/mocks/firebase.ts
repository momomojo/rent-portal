import { vi } from 'vitest';

export const mockFirebase = () => {
  const mockAuth = {
    currentUser: null,
    onAuthStateChanged: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
  };

  const mockFirestore = {
    collection: vi.fn(),
    doc: vi.fn(),
    getDoc: vi.fn(),
    getDocs: vi.fn(),
    addDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    onSnapshot: vi.fn(),
  };

  const mockStorage = {
    ref: vi.fn(),
    uploadBytes: vi.fn(),
    getDownloadURL: vi.fn(),
  };

  vi.mock('firebase/auth', () => ({
    getAuth: vi.fn(() => mockAuth),
    signInWithEmailAndPassword: mockAuth.signInWithEmailAndPassword,
    createUserWithEmailAndPassword: mockAuth.createUserWithEmailAndPassword,
    signOut: mockAuth.signOut,
    onAuthStateChanged: mockAuth.onAuthStateChanged,
  }));

  vi.mock('firebase/firestore', () => ({
    getFirestore: vi.fn(() => mockFirestore),
    collection: mockFirestore.collection,
    doc: mockFirestore.doc,
    getDoc: mockFirestore.getDoc,
    getDocs: mockFirestore.getDocs,
    addDoc: mockFirestore.addDoc,
    updateDoc: mockFirestore.updateDoc,
    deleteDoc: mockFirestore.deleteDoc,
    query: mockFirestore.query,
    where: mockFirestore.where,
    orderBy: mockFirestore.orderBy,
    onSnapshot: mockFirestore.onSnapshot,
  }));

  vi.mock('firebase/storage', () => ({
    getStorage: vi.fn(() => mockStorage),
    ref: mockStorage.ref,
    uploadBytes: mockStorage.uploadBytes,
    getDownloadURL: mockStorage.getDownloadURL,
  }));

  return {
    mockAuth,
    mockFirestore,
    mockStorage,
  };
};