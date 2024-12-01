import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from '@shared/hooks/useAuthState';
import { LoadingSpinner } from '@components/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';

export const EmailVerifiedPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuthState();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <Typography variant="h4" className="text-center">
            Email Verified Successfully!
          </Typography>
          <Typography variant="body1" className="text-muted-foreground">
            Your email has been verified. You can now access all features of the application.
          </Typography>
        </div>
        <Button
          onClick={() => navigate('/dashboard')}
          className="w-full"
        >
          Continue to Dashboard
        </Button>
      </div>
    </div>
  );
};
