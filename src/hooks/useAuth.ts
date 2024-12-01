import { useState, useCallback } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
  signOut
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError } from '../lib/firebase';
import { UserProfile, UserRole } from '../types/user';
import { toast } from 'sonner';

export function useAuth() {
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login
      await updateDoc(doc(db, 'users', user.uid), {
        lastLogin: Date.now()
      });

      // Record session
      await setDoc(doc(db, 'sessions', crypto.randomUUID()), {
        userId: user.uid,
        device: navigator.userAgent,
        browser: navigator.userAgent,
        ip: '127.0.0.1', // In production, get from server
        startTime: Date.now(),
        lastActivity: Date.now(),
        active: true
      });

      toast.success('Logged in successfully');
    } catch (error) {
      console.error('Login error:', error);
      handleFirestoreError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    role: UserRole
  ) => {
    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      await updateProfile(user, { displayName: name });
      await sendEmailVerification(user);

      const userProfile: UserProfile = {
        uid: user.uid,
        email,
        name,
        role,
        status: 'pending',
        createdAt: Date.now(),
        notificationPreferences: {
          email: true,
          push: false,
          sms: false
        },
        settings: {
          language: 'en',
          theme: 'system',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        verifiedEmail: false,
        verifiedPhone: false
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);
      toast.success('Account created successfully! Please verify your email.');
    } catch (error) {
      console.error('Registration error:', error);
      handleFirestoreError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent');
    } catch (error) {
      console.error('Password reset error:', error);
      handleFirestoreError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
    setLoading(true);
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      await updateDoc(userRef, {
        ...updates,
        updatedAt: Date.now()
      });

      if (updates.name && auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: updates.name });
      }

      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Profile update error:', error);
      handleFirestoreError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      // Update session status
      const sessions = await db.collection('sessions')
        .where('userId', '==', auth.currentUser?.uid)
        .where('active', '==', true)
        .get();

      const batch = db.batch();
      sessions.docs.forEach(doc => {
        batch.update(doc.ref, { active: false });
      });
      await batch.commit();

      await signOut(auth);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      handleFirestoreError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    login,
    register,
    resetPassword,
    updateUserProfile,
    logout
  };
}