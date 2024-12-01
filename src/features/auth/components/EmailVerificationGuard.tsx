import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Alert } from '@/components/ui/Alert';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { CircularProgress } from '@/components/ui/CircularProgress';
import { useAuthState } from '@shared/hooks/useAuthState';
import { useEmailVerification } from '../hooks/useEmailVerification';

interface EmailVerificationGuardProps {
  children: React.ReactNode;
  redirectUrl?: string;
  enforceVerification?: boolean;
}

export const EmailVerificationGuard: React.FC<EmailVerificationGuardProps> = ({ 
  children, 
  redirectUrl = '/login',
  enforceVerification = true
}) => {
  const { user } = useAuthState();
  const { 
    sending, 
    error, 
    sendVerificationEmail, 
    checkVerificationStatus,
    attempts,
    lastSentAt
  } = useEmailVerification();
  const [isVerified, setIsVerified] = useState(false);
  const [checking, setChecking] = useState(true);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    const checkStatus = async () => {
      if (!user) {
        setChecking(false);
        return;
      }
      const verified = await checkVerificationStatus();
      setIsVerified(verified);
      setChecking(false);
    };
    checkStatus();

    // Set initial cooldown if applicable
    if (lastSentAt) {
      const remainingCooldown = Math.max(0, 60 - Math.floor((Date.now() - lastSentAt) / 1000));
      if (remainingCooldown > 0) {
        setResendCooldown(remainingCooldown);
      }
    }
  }, [user, checkVerificationStatus, lastSentAt]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleResendEmail = async () => {
    if (attempts >= 5) {
      return; // Max attempts reached
    }
    await sendVerificationEmail();
    setResendCooldown(60);
  };

  if (checking) {
    return (
      <div className="flex items-center justify-center p-8">
        <CircularProgress size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectUrl} replace />;
  }

  if (!isVerified && enforceVerification) {
    return (
      <div className="p-4">
        <Alert variant="warning">
          <div className="flex flex-col gap-4">
            <Typography variant="h6">Email Verification Required</Typography>
            <Typography variant="body1">
              Please verify your email address to access this section.
            </Typography>
            <div className="flex gap-2">
              <Button
                onClick={handleResendEmail}
                variant="outline"
                className="gap-2"
                disabled={sending || resendCooldown > 0 || attempts >= 5}
              >
                {sending ? (
                  <CircularProgress size={20} />
                ) : resendCooldown > 0 ? (
                  `Resend in ${resendCooldown}s`
                ) : attempts >= 5 ? (
                  'Too many attempts'
                ) : (
                  'Resend Email'
                )}
              </Button>
            </div>
          </div>
        </Alert>
        
        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}
        
        <div className="bg-white rounded-lg shadow p-4 mt-4">
          <Typography variant="body2" color="text.secondary" className="mb-2">
            An email verification link has been sent to your email address.
            Please check your inbox and spam folder.
          </Typography>
          
          {attempts > 0 && (
            <Typography variant="caption" color="text.secondary" display="block">
              Verification emails sent: {attempts}/5
            </Typography>
          )}
          
          {attempts >= 5 && (
            <Alert severity="info" className="mt-4">
              Maximum attempts reached. Please contact support if you haven't received the verification email.
            </Alert>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};