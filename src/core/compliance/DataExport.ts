import { auth, db } from '../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  DocumentData,
} from 'firebase/firestore';

interface UserData {
  personalInfo: {
    email: string;
    name?: string;
    phone?: string;
  };
  preferences: {
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    cookies: {
      necessary: boolean;
      analytics: boolean;
      marketing: boolean;
      preferences: boolean;
    };
  };
  activity: {
    lastLogin?: Date;
    createdAt: Date;
    loginHistory: Date[];
  };
}

export const exportUserData = async (): Promise<UserData | null> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No user is currently logged in');
    }

    // Get user profile data
    const userProfileQuery = query(
      collection(db, 'users'),
      where('uid', '==', currentUser.uid)
    );
    const userProfileSnapshot = await getDocs(userProfileQuery);
    const userProfile = userProfileSnapshot.docs[0]?.data() || {};

    // Get user preferences
    const preferencesQuery = query(
      collection(db, 'preferences'),
      where('userId', '==', currentUser.uid)
    );
    const preferencesSnapshot = await getDocs(preferencesQuery);
    const preferences = preferencesSnapshot.docs[0]?.data() || {};

    // Get user activity
    const activityQuery = query(
      collection(db, 'activity'),
      where('userId', '==', currentUser.uid)
    );
    const activitySnapshot = await getDocs(activityQuery);
    const activity = activitySnapshot.docs[0]?.data() || {};

    // Compile user data
    const userData: UserData = {
      personalInfo: {
        email: currentUser.email || '',
        name: userProfile.name,
        phone: userProfile.phone,
      },
      preferences: {
        notifications: preferences.notifications || {
          email: false,
          push: false,
          sms: false,
        },
        cookies: preferences.cookies || {
          necessary: true,
          analytics: false,
          marketing: false,
          preferences: false,
        },
      },
      activity: {
        lastLogin: activity.lastLogin?.toDate(),
        createdAt: currentUser.metadata.creationTime
          ? new Date(currentUser.metadata.creationTime)
          : new Date(),
        loginHistory: (activity.loginHistory || []).map((timestamp: any) =>
          timestamp.toDate()
        ),
      },
    };

    return userData;
  } catch (error) {
    console.error('Error exporting user data:', error);
    return null;
  }
};

export const downloadUserData = async () => {
  const userData = await exportUserData();
  if (!userData) {
    throw new Error('Failed to export user data');
  }

  // Create a JSON blob and trigger download
  const dataStr = JSON.stringify(userData, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `user-data-${new Date().toISOString()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const deleteUserData = async () => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No user is currently logged in');
    }

    // Delete user data from all collections
    const collections = ['users', 'preferences', 'activity'];
    for (const collectionName of collections) {
      const q = query(
        collection(db, collectionName),
        where('userId', '==', currentUser.uid)
      );
      const snapshot = await getDocs(q);
      for (const doc of snapshot.docs) {
        await doc.ref.delete();
      }
    }

    // Delete the user account
    await currentUser.delete();

    return true;
  } catch (error) {
    console.error('Error deleting user data:', error);
    return false;
  }
};
