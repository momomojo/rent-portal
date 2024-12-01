import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '@core/config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useAppDispatch, useAppSelector } from '@core/hooks';
import {
  signIn,
  signUp,
  signOut,
  resetPassword,
  setUser,
  setUserRole,
  clearError,
} from '../store/authSlice';
import { getUserRole } from '../api/userProfile';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      dispatch(setUser(firebaseUser));
      if (firebaseUser) {
        const role = await getUserRole(firebaseUser.uid);
        if (role) {
          dispatch(setUserRole(role));
        }
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        await dispatch(signIn({ email, password })).unwrap();
        navigate('/dashboard');
      } catch (error) {
        console.error('Login failed:', error);
      }
    },
    [dispatch, navigate]
  );

  const register = useCallback(
    async (email: string, password: string, displayName: string) => {
      try {
        await dispatch(signUp({ email, password, displayName })).unwrap();
        navigate('/dashboard');
      } catch (error) {
        console.error('Registration failed:', error);
      }
    },
    [dispatch, navigate]
  );

  const logout = useCallback(async () => {
    try {
      await dispatch(signOut()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [dispatch, navigate]);

  const forgotPassword = useCallback(
    async (email: string) => {
      try {
        await dispatch(resetPassword(email)).unwrap();
        return true;
      } catch (error) {
        console.error('Password reset failed:', error);
        return false;
      }
    },
    [dispatch]
  );

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    clearAuthError,
  };
};
