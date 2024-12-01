import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { AuthForm } from '../components/AuthForm';
import { RootState } from '@core/store/types';
import { LoadingSpinner } from '@shared/components/LoadingSpinner';

export const SignupPage: React.FC = () => {
  const { user, loading, emailVerification } = useSelector((state: RootState) => state.auth);

  if (loading) {
    return <LoadingSpinner />;
  }

  // Redirect authenticated and verified users to dashboard
  if (user?.emailVerified) {
    return <Navigate to="/dashboard" replace />;
  }

  // Redirect users who need to verify their email
  if (user && emailVerification.verificationEmailSent) {
    return <Navigate to="/verify-email" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <AuthForm type="register" />
    </div>
  );
};