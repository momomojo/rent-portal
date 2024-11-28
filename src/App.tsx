import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Navigation from './components/Navigation';
import AuthForm from './components/AuthForm';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthState } from './hooks/useAuthState';
import { useRoleAccess } from './hooks/useRoleAccess';
import OfflineIndicator from './components/OfflineIndicator';
import { UserRole } from './types/user';

// Lazy load components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const Messages = lazy(() => import('./pages/Messages'));
const Profile = lazy(() => import('./pages/Profile'));
const Properties = lazy(() => import('./pages/admin/Properties'));
const LandlordProperties = lazy(() => import('./pages/landlord/Properties'));
const Tenants = lazy(() => import('./pages/admin/Tenants'));
const RentManagement = lazy(() => import('./pages/admin/RentManagement'));
const Reports = lazy(() => import('./pages/admin/Reports'));
const Settings = lazy(() => import('./pages/admin/Settings'));
const Documents = lazy(() => import('./pages/Documents'));
const Payments = lazy(() => import('./pages/Payments'));
const Maintenance = lazy(() => import('./pages/Maintenance'));

// Loading fallback component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
  </div>
);

const AdminRoutes: React.FC = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="properties" element={<Properties />} />
      <Route path="tenants" element={<Tenants />} />
      <Route path="rent" element={<RentManagement />} />
      <Route path="reports" element={<Reports />} />
      <Route path="settings" element={<Settings />} />
      <Route path="documents" element={<Documents />} />
      <Route path="maintenance" element={<Maintenance />} />
      <Route path="messages" element={<Messages />} />
    </Routes>
  </Suspense>
);

const LandlordRoutes: React.FC = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="properties" element={<LandlordProperties />} />
      <Route path="tenants" element={<Tenants />} />
      <Route path="maintenance" element={<Maintenance />} />
      <Route path="rent" element={<RentManagement />} />
      <Route path="documents" element={<Documents />} />
      <Route path="messages" element={<Messages />} />
    </Routes>
  </Suspense>
);

const TenantRoutes: React.FC = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="payments" element={<Payments />} />
      <Route path="maintenance" element={<Maintenance />} />
      <Route path="documents" element={<Documents />} />
      <Route path="messages" element={<Messages />} />
    </Routes>
  </Suspense>
);

export default function App() {
  const { user, loading } = useAuthState();
  const { isAdmin, isLandlord } = useRoleAccess();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public routes */}
            <Route
              path="/login"
              element={user ? <Navigate to="/dashboard" replace /> : <AuthForm type="login" />}
            />
            <Route
              path="/register"
              element={user ? <Navigate to="/dashboard" replace /> : <AuthForm type="register" />}
            />

            {/* Admin routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={['admin' as UserRole]}>
                  <AdminRoutes />
                </ProtectedRoute>
              }
            />

            {/* Landlord routes */}
            <Route
              path="/landlord/*"
              element={
                <ProtectedRoute allowedRoles={['landlord' as UserRole]}>
                  <LandlordRoutes />
                </ProtectedRoute>
              }
            />

            {/* Tenant routes */}
            <Route
              path="/tenant/*"
              element={
                <ProtectedRoute allowedRoles={['tenant' as UserRole]}>
                  <TenantRoutes />
                </ProtectedRoute>
              }
            />

            {/* Common protected routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Dashboard route - redirects based on role */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  {isAdmin ? (
                    <Navigate to="/admin" replace />
                  ) : isLandlord ? (
                    <Navigate to="/landlord" replace />
                  ) : (
                    <Navigate to="/tenant" replace />
                  )}
                </ProtectedRoute>
              }
            />

            {/* Default route */}
            <Route
              path="/"
              element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
            />
          </Routes>
        </Suspense>
        <OfflineIndicator />
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}
