import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const emailActionConfig = {
  url: `${window.location.origin}/email-verified`,
  handleCodeInApp: true,
  // Optional: Add these if you have mobile apps
  iOS: {
    bundleId: import.meta.env.VITE_IOS_BUNDLE_ID
  },
  android: {
    packageName: import.meta.env.VITE_ANDROID_PACKAGE_NAME,
    installApp: true,
    minimumVersion: '12'
  },
  dynamicLinkDomain: import.meta.env.VITE_DYNAMIC_LINK_DOMAIN
};

// Helper function to get action code settings
export const getActionCodeSettings = (redirectUrl?: string) => ({
  ...emailActionConfig,
  url: redirectUrl || emailActionConfig.url
});