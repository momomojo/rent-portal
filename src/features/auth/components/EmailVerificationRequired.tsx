import React, { useEffect, useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { CircularProgress } from '@/components/ui/CircularProgress';
import { useEmailVerification } from '../hooks/useEmailVerification';

interface EmailVerificationRequiredProps {
  email: string;
  onResendVerification: () => Promise<void>;
  isResending: boolean;
}

export const EmailVerificationRequired: React.FC<EmailVerificationRequiredProps> = ({
  email,
  onResendVerification,
  isResending
}) => {
  const { sending, error, sendVerificationEmail } = useEmailVerification();
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResend = async () => {
    await sendVerificationEmail();
    setCooldown(60); // 60 second cooldown
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <Alert variant="warning">
        <div className="flex flex-col gap-4">
          <Typography variant="h5">Email Verification Required</Typography>
          <Typography variant="body1">
            We've sent a verification email to <strong>{email}</strong>. Please check your inbox and click the verification link to continue.
          </Typography>
          <Typography variant="body2" className="text-muted-foreground">
            If you don't see the email, check your spam folder or click the button below to resend the verification email.
          </Typography>
          <div className="mt-4">
            <Button
              onClick={handleResend}
              disabled={sending || cooldown > 0}
              variant="outline"
              className="w-full"
            >
              {sending ? (
                <>
                  <CircularProgress size="sm" className="mr-2" />
                  Sending...
                </>
              ) : cooldown > 0 ? (
                `Resend in ${cooldown}s`
              ) : (
                'Resend Verification Email'
              )}
            </Button>
          </div>
        </div>
      </Alert>
      {error && (
        <Alert variant="error" className="mt-4">
          {error}
        </Alert>
      )}
    </div>
  );
};
