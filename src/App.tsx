import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Navigation from './components/Navigation';
import AuthForm from './components/AuthForm';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Properties from './pages/admin/Properties';
import LandlordProperties from './pages/landlord/Properties';
import Tenants from './pages/admin/Tenants';
import RentManagement from './pages/admin/RentManagement';
import Reports from './pages/admin/Reports';
import Settings from './pages/admin/Settings';
import Documents from './pages/Documents';
import Payments from './pages/Payments';
import Maintenance from './pages/Maintenance';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthState } from './hooks/useAuthState';
import { useRoleAccess } from './hooks/useRoleAccess';
import OfflineIndicator from './components/OfflineIndicator';
import { UserRole } from './types/user';

const AdminRoutes: React.FC = () => (
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
);

const LandlordRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="properties" element={<LandlordProperties />} />
    <Route path="tenants" element={<Tenants />} />
    <Route path="maintenance" element={<Maintenance />} />
    <Route path="rent" element={<RentManagement />} />
    <Route path="documents" element={<Documents />} />
    <Route path="messages" element={<Messages />} />
  </Routes>
);

const TenantRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="payments" element={<Payments />} />
    <Route path="maintenance" element={<Maintenance />} />
    <Route path="documents" element={<Documents />} />
    <Route path="messages" element={<Messages />} />
  </Routes>
);

export default function App() {
  const { user, loading } = useAuthState();
  const { isAdmin, isLandlord } = useRoleAccess();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
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
        <OfflineIndicator />
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}
