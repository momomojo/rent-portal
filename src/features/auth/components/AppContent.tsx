import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useSessionTimeout } from '../hooks/useSessionTimeout';
import { SessionTimeoutWarning } from './SessionTimeoutWarning';
import { theme } from '@core/theme';
import { AppRoutes } from './AppRoutes';
import { useAuthState } from '@shared/hooks/useAuthState';
import { useNavigate } from 'react-router-dom';

export const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthState();
  const { 
    showWarning, 
    remainingTime, 
    resetSession, 
    handleSignOut,
    isInactive
  } = useSessionTimeout({
    sessionDuration: 30 * 60 * 1000, // 30 minutes
    warningThreshold: 5 * 60 * 1000, // 5 minutes warning
    inactivityThreshold: 15 * 60 * 1000 // 15 minutes inactivity
  });
  
  const [warningOpen, setWarningOpen] = useState(false);

  useEffect(() => {
    setWarningOpen(showWarning);
  }, [showWarning]);

  useEffect(() => {
    if (isInactive && user) {
      handleSignOut();
      navigate('/login', { 
        state: { 
          message: 'You have been logged out due to inactivity.' 
        } 
      });
    }
  }, [isInactive, user, handleSignOut, navigate]);

  const handleExtendSession = () => {
    resetSession();
    setWarningOpen(false);
  };

  const handleClose = () => {
    setWarningOpen(false);
    handleSignOut();
    navigate('/login');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="min-h-screen">
        <SessionTimeoutWarning
          open={warningOpen}
          onExtend={handleExtendSession}
          onClose={handleClose}
          remainingTime={remainingTime}
        />
        <AppRoutes />
      </div>
    </ThemeProvider>
  );
};