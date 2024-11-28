import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoleAccess } from '../hooks/useRoleAccess';
import { toast } from 'sonner';

export function withRoleVerification(
  WrappedComponent: React.ComponentType,
  allowedRoles: string[]
) {
  return function ProtectedComponent(props: any) {
    const { role, loading } = useRoleAccess();
    const navigate = useNavigate();

    useEffect(() => {
      if (!loading && role && !allowedRoles.includes(role)) {
        toast.error('Unauthorized access');
        navigate('/dashboard');
      }
    }, [role, loading, navigate]);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      );
    }

    if (!role || !allowedRoles.includes(role)) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}