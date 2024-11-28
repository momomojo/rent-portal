import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth, handleFirestoreError } from '../lib/firebase';
import { toast } from 'sonner';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      (user) => {
        setUser(user);
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error('Auth state error:', error);
        setError(error);
        setLoading(false);
        handleFirestoreError(error);
      }
    );

    // Check initial connection state
    if (!navigator.onLine) {
      toast.warning('You are offline. Some features may be limited.');
    }

    return () => unsubscribe();
  }, []);

  return { user, loading, error };
}