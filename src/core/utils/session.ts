import { auth } from '@core/config/firebase';
import { store } from '@core/store';
import { signOut } from '@features/auth/store/authSlice';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
let sessionTimer: NodeJS.Timeout;

export function initializeSessionManager() {
  // Reset timer on user activity
  const resetTimer = () => {
    if (sessionTimer) {
      clearTimeout(sessionTimer);
    }
    sessionTimer = setTimeout(handleSessionTimeout, SESSION_TIMEOUT);
  };

  // Add event listeners for user activity
  const events = ['mousedown', 'keydown', 'touchstart', 'mousemove'];
  events.forEach((event) => {
    document.addEventListener(event, resetTimer);
  });

  // Initial timer setup
  resetTimer();

  // Clean up on unmount
  return () => {
    if (sessionTimer) {
      clearTimeout(sessionTimer);
    }
    events.forEach((event) => {
      document.removeEventListener(event, resetTimer);
    });
  };
}

async function handleSessionTimeout() {
  try {
    await store.dispatch(signOut()).unwrap();
    window.location.href = '/login?timeout=true';
  } catch (error) {
    console.error('Error handling session timeout:', error);
  }
}

export async function refreshSession() {
  const user = auth.currentUser;
  if (user) {
    try {
      const token = await user.getIdToken(true);
      return token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }
  throw new Error('No user logged in');
}

export function getAuthToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) {
    return Promise.reject(new Error('No user logged in'));
  }
  return user.getIdToken();
}
