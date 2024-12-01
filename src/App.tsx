import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@core/store';
import { useDispatch } from 'react-redux';
import { auth } from '@core/config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { setUser, setInitialized } from '@features/auth/store/authSlice';
import { useSessionTimeout } from '@features/auth/hooks/useSessionTimeout';
import { SessionWarningDialog } from '@features/auth/components/SessionWarningDialog';
import { ProtectedRoute } from '@features/auth/components/ProtectedRoute';
import { Layout } from '@shared/components/Layout';
import { BaseErrorBoundary, AuthErrorBoundary, RouteErrorBoundary } from '@core/components/ErrorBoundaries';
import { performanceService } from '@core/services/performance';
import { Suspense, lazy } from 'react';
import { LoadingFallback, PageLoadingFallback } from '@components/LoadingFallback';

// Lazy load components with preloading
const DashboardPage = lazy(() => {
  const module = import('@features/dashboard/pages/DashboardPage');
  // Prefetch related components
  import('@features/properties/components/Properties');
  import('@features/maintenance/components/MaintenanceRequests');
  return module;
});

const ProfilePage = lazy(() => import('@features/profile/pages/ProfilePage'));
const SettingsPage = lazy(() => import('@features/settings/pages/SettingsPage'));

// Import other pages...

function AppContent() {
  const dispatch = useDispatch();
  const {
    showWarning,
    remainingTime,
    resetSession,
    handleSignOut,
    isInactive
  } = useSessionTimeout();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch(setUser(user));
      dispatch(setInitialized(true));
    });

    // Initialize performance monitoring
    performanceService.subscribe((metrics) => {
      const poorMetrics = metrics.filter((m) => m.rating === 'poor');
      if (poorMetrics.length > 0) {
        console.warn('Poor performance metrics detected:', poorMetrics);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  // Auto logout if inactive
  useEffect(() => {
    if (isInactive) {
      handleSignOut();
    }
  }, [isInactive, handleSignOut]);

  return (
    <BaseErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Suspense fallback={<PageLoadingFallback />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/email-verified" element={<EmailVerifiedPage />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Suspense fallback={<LoadingFallback />}>
                      <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                      </Routes>
                    </Suspense>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>

        <SessionWarningDialog
          open={showWarning}
          remainingTime={remainingTime}
          onExtend={resetSession}
          onLogout={handleSignOut}
        />
      </div>
    </BaseErrorBoundary>
  );
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthErrorBoundary>
          <RouteErrorBoundary>
            <AppContent />
          </RouteErrorBoundary>
        </AuthErrorBoundary>
      </PersistGate>
    </Provider>
  );
}

export default App;