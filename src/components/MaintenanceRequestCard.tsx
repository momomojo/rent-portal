import React, { memo, useMemo } from 'react';
import { MaintenanceRequest, MaintenanceStatus } from '../types/maintenance';

interface MaintenanceRequestCardProps {
  request: MaintenanceRequest;
  onUpdate: () => void;
}

const statusColors: Record<MaintenanceStatus, string> = {
  'pending': 'bg-yellow-100 text-yellow-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  'completed': 'bg-green-100 text-green-800',
  'cancelled': 'bg-red-100 text-red-800'
};

const formatDate = (timestamp: number) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(timestamp));
};

const MaintenanceRequestCard = memo(({ request, onUpdate }: MaintenanceRequestCardProps) => {
  // Memoize computed values
  const statusColor = useMemo(() => 
    statusColors[request.status] || statusColors.pending,
    [request.status]
  );

  const formattedCreatedDate = useMemo(() => 
    formatDate(request.createdAt),
    [request.createdAt]
  );

  const formattedScheduledDate = useMemo(() => 
    request.scheduledDate ? formatDate(request.scheduledDate) : null,
    [request.scheduledDate]
  );

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-all hover:shadow-md"
      role="article"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{request.description}</p>
        </div>
        <span 
          className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}
          role="status"
        >
          {request.status}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
        <div>
          <span className="font-medium">Priority:</span>{' '}
          <span className={`capitalize ${
            request.priority === 'urgent' ? 'text-red-600' : ''
          }`}>
            {request.priority}
          </span>
        </div>
        <div>
          <span className="font-medium">Created:</span>{' '}
          {formattedCreatedDate}
        </div>
        {formattedScheduledDate && (
          <div>
            <span className="font-medium">Scheduled:</span>{' '}
            {formattedScheduledDate}
          </div>
        )}
      </div>

      {request.images && request.images.length > 0 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
          {request.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Maintenance request ${index + 1}`}
              className="h-20 w-20 object-cover rounded-lg"
              loading="lazy"
              width={80}
              height={80}
            />
          ))}
        </div>
      )}

      {request.status !== 'completed' && request.status !== 'cancelled' && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={onUpdate}
            className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            aria-label="Update maintenance request status"
          >
            Update Status
          </button>
        </div>
      )}
    </div>
  );
});

MaintenanceRequestCard.displayName = 'MaintenanceRequestCard';

export default MaintenanceRequestCard;
