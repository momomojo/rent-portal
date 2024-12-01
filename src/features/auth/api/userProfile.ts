import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@core/config/firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'landlord' | 'tenant';
  createdAt: Date;
  updatedAt: Date;
}

export async function getUserRole(uid: string): Promise<'admin' | 'landlord' | 'tenant' | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data().role;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user role:', error);
    return null;
  }
}

export async function createUserProfile(profile: Omit<UserProfile, 'createdAt' | 'updatedAt'>): Promise<void> {
  const now = new Date();
  const userProfile: UserProfile = {
    ...profile,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await setDoc(doc(db, 'users', profile.uid), userProfile);
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
}

export async function updateUserProfile(
  uid: string,
  updates: Partial<Omit<UserProfile, 'uid' | 'createdAt'>>
): Promise<void> {
  const now = new Date();
  try {
    await setDoc(
      doc(db, 'users', uid),
      {
        ...updates,
        updatedAt: now,
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}
