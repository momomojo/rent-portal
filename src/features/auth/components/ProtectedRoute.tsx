import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  requireAuth?: boolean;
  redirectTo?: string;
}

export const ProtectedRoute = ({
  requireAuth = true,
  redirectTo = "/auth/login",
}: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (requireAuth && !isAuthenticated) {
    // Redirect them to the login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    // If we're on a non-auth required route (like login) and we're already authenticated,
    // redirect to the home page
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
