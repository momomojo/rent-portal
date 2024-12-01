import { useState } from 'react';
import { useVendors } from '../../hooks/useVendors';
import { format } from 'date-fns';
import { Calendar, Clock, Wrench, X } from 'lucide-react';
import { MaintenanceRequest } from '../../types/maintenance';

export interface MaintenanceScheduleProps {
  onClose: () => void;
  requests: MaintenanceRequest[];
}

export default function MaintenanceSchedule({ onClose, requests }: MaintenanceScheduleProps): JSX.Element {
  const { assignments, vendors } = useVendors();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const dailySchedule = assignments
    .filter(assignment => 
      format(assignment.scheduledDate!, 'yyyy-MM-dd') === selectedDate
    )
    .sort((a, b) => a.scheduledDate! - b.scheduledDate!);

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Maintenance Schedule
            </h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {dailySchedule.length > 0 ? (
              dailySchedule.map((assignment) => {
                const vendor = vendors.find(v => v.id === assignment.vendorId);
                const request = requests.find(r => r.id === assignment.maintenanceRequestId);
                return (
                  <div
                    key={assignment.id}
                    className="border rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Wrench className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {vendor?.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {request?.title || `Maintenance ID: ${assignment.maintenanceRequestId}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {format(assignment.scheduledDate!, 'h:mm a')}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          assignment.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : assignment.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {assignment.status}
                      </span>
                      {request && (
                        <p className="mt-2 text-sm text-gray-600">
                          {request.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <Wrench className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No maintenance scheduled
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  No maintenance requests are scheduled for this date.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
