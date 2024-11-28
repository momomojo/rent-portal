import { format } from 'date-fns';
import { AlertTriangle, Clock, CheckCircle, XCircle, Wrench } from 'lucide-react';
import type { MaintenanceRequest } from '../types/maintenance';

export interface MaintenanceRequestCardProps {
  request: MaintenanceRequest;
  onUpdate: () => void;
  onAction?: () => void;
  isLandlord?: boolean;
}

export default function MaintenanceRequestCard({ 
  request, 
  onUpdate, 
  onAction,
  isLandlord 
}: MaintenanceRequestCardProps) {
  const getStatusIcon = () => {
    switch (request.status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'in-progress':
        return <Wrench className="h-5 w-5 text-indigo-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'declined':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getPriorityBadge = () => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      emergency: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[request.priority]}`}>
        {request.priority === 'emergency' && <AlertTriangle className="h-3 w-3 mr-1" />}
        {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
      </span>
    );
  };

  return (
    <div 
      className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={onAction}
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className="text-sm font-medium text-gray-900">
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </span>
          </div>
          {getPriorityBadge()}
        </div>

        <h3 className="text-lg font-medium text-gray-900 mb-2">{request.title}</h3>
        <p className="text-sm text-gray-500 mb-4">{request.description}</p>

        {request.images && request.images.length > 0 && (
          <div className="mb-4">
            <div className="grid grid-cols-3 gap-2">
              {request.images.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt=""
                  className="h-20 w-full object-cover rounded"
                />
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 pt-4">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div>
              <dt className="text-gray-500">Category</dt>
              <dd className="font-medium text-gray-900">
                {request.category.charAt(0).toUpperCase() + request.category.slice(1)}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Submitted</dt>
              <dd className="font-medium text-gray-900">
                {format(request.createdAt, 'MMM d, yyyy')}
              </dd>
            </div>
            {request.scheduledDate && (
              <div className="col-span-2">
                <dt className="text-gray-500">Scheduled</dt>
                <dd className="font-medium text-gray-900">
                  {format(request.scheduledDate, 'MMM d, yyyy h:mm a')}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {isLandlord && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAction?.();
              }}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Manage Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
