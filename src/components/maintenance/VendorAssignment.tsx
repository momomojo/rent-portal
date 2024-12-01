import { useState } from 'react';
import { MaintenanceRequest } from '../../types/maintenance';
import { useVendors } from '../../hooks/useVendors';
import { Calendar, Clock, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

export interface VendorAssignmentProps {
  request: MaintenanceRequest;
  onClose: () => void;
}

export default function VendorAssignment({ request, onClose }: VendorAssignmentProps): JSX.Element {
  const { vendors, assignVendor } = useVendors();
  const [selectedVendor, setSelectedVendor] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  const availableVendors = vendors.filter(vendor =>
    vendor.services.includes(request.category)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVendor || !scheduledDate || !scheduledTime) return;

    const scheduledTimestamp = new Date(`${scheduledDate}T${scheduledTime}`).getTime();
    await assignVendor(selectedVendor, request.id, scheduledTimestamp);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <form onSubmit={handleSubmit} className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Assign Vendor
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Vendor
              </label>
              <select
                value={selectedVendor}
                onChange={(e) => setSelectedVendor(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              >
                <option value="">Choose a vendor</option>
                {availableVendors.map((vendor) => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.name} - ${vendor.hourlyRate}/hr
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Schedule Date
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Schedule Time
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            {selectedVendor && (
              <div className="rounded-md bg-gray-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-800">
                      Estimated Cost
                    </h3>
                    <div className="mt-2 text-sm text-gray-600">
                      <p>Hourly Rate: ${vendors.find(v => v.id === selectedVendor)?.hourlyRate}</p>
                      <p>* Final cost may vary based on actual time and materials</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-5 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Assign Vendor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
