import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home,
  LogOut, 
  MessageSquare, 
  User, 
  DollarSign,
  Building,
  Users,
  BarChart,
  FileText,
  Wrench,
  Settings,
  ClipboardList
} from 'lucide-react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { useAuthState } from '../hooks/useAuthState';
import { useRoleAccess } from '../hooks/useRoleAccess';
import { toast } from 'sonner';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthState();
  const { isAdmin, isLandlord, isTenant } = useRoleAccess();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };

  const adminLinks = [
    { to: '/admin', label: 'Dashboard', icon: Home },
    { to: '/admin/properties', label: 'Properties', icon: Building },
    { to: '/admin/tenants', label: 'Tenants', icon: Users },
    { to: '/admin/rent', label: 'Rent Management', icon: DollarSign },
    { to: '/admin/reports', label: 'Reports', icon: BarChart },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
    { to: '/admin/maintenance', label: 'Maintenance', icon: Wrench },
    { to: '/admin/documents', label: 'Documents', icon: FileText },
    { to: '/admin/messages', label: 'Messages', icon: MessageSquare }
  ];

  const landlordLinks = [
    { to: '/landlord', label: 'Dashboard', icon: Home },
    { to: '/landlord/properties', label: 'Properties', icon: Building },
    { to: '/landlord/tenants', label: 'Tenants', icon: Users },
    { to: '/landlord/maintenance', label: 'Maintenance', icon: Wrench },
    { to: '/landlord/rent', label: 'Rent Management', icon: DollarSign },
    { to: '/landlord/documents', label: 'Documents', icon: FileText },
    { to: '/landlord/messages', label: 'Messages', icon: MessageSquare }
  ];

  const tenantLinks = [
    { to: '/tenant', label: 'Dashboard', icon: Home },
    { to: '/tenant/payments', label: 'Payments', icon: DollarSign },
    { to: '/tenant/maintenance', label: 'Maintenance', icon: Wrench },
    { to: '/tenant/documents', label: 'Documents', icon: FileText },
    { to: '/tenant/messages', label: 'Messages', icon: MessageSquare }
  ];

  const getLinks = () => {
    const links = isAdmin ? adminLinks : isLandlord ? landlordLinks : tenantLinks;
    return [...links, { to: '/profile', label: 'Profile', icon: User }];
  };

  const isLinkActive = (to: string) => {
    if (to === '/') return location.pathname === to;
    return location.pathname.startsWith(to);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Home className="h-6 w-6 text-indigo-600" />
              <span className="font-bold text-xl text-gray-900">RentPortal</span>
            </Link>
          </div>

          {user && (
            <div className="hidden md:flex items-center space-x-4">
              {getLinks().map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 ${
                    isLinkActive(link.to) ? 'text-indigo-600 bg-indigo-50' : ''
                  }`}
                >
                  <link.icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          )}

          {!user && (
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-indigo-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {user ? (
              getLinks().map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2 ${
                    isLinkActive(link.to) ? 'text-indigo-600 bg-indigo-50' : ''
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <link.icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              ))
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white hover:bg-indigo-700 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
