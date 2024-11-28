import { format } from 'date-fns';
import { TenantApplication } from '../../types/application';
import { CheckCircle, Clock, AlertTriangle, XCircle, User } from 'lucide-react';

interface ApplicationListProps {
  applications: TenantApplication[];
  selectedId?: string;
  onSelect: (application: TenantApplication) => void;
}

export default function ApplicationList({ applications, selectedId, onSelect }: ApplicationListProps) {
  const getStatusIcon = (status: TenantApplication['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'screening':
        return <AlertTriangle className="h-5 w-5 text-blue-500" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'waitlist':
        return <Clock className="h-5 w-5 text-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul role="list" className="divide-y divide-gray-200">
        {applications.map((application) => (
          <li key={application.id}>
            <button
              onClick={() => onSelect(application)}
              className={`w-full block hover:bg-gray-50 ${
                selectedId === application.id ? 'bg-gray-50' : ''
              }`}
            >
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900 text-left">
                        {application.personalInfo.firstName} {application.personalInfo.lastName}
                      </p>
                      <p className="text-sm text-gray-500 text-left">
                        {application.personalInfo.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {getStatusIcon(application.status)}
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      Applied {format(application.createdAt, 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      application.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : application.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : application.status === 'screening'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}