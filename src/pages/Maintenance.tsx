import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthState } from '../hooks/useAuthState';
import { useRoleAccess } from '../hooks/useRoleAccess';
import { MaintenanceRequest } from '../types/maintenance';
import { Plus, Filter, Clock, Wrench } from 'lucide-react';
import MaintenanceRequestForm from '../components/MaintenanceRequestForm';
import MaintenanceRequestCard from '../components/MaintenanceRequestCard';
import VendorAssignment from '../components/maintenance/VendorAssignment';
import MaintenanceSchedule from '../components/maintenance/MaintenanceSchedule';

export default function Maintenance() {
  const { user } = useAuthState();
  const { isLandlord, isTenant } = useRoleAccess();
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showVendorAssignment, setShowVendorAssignment] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<MaintenanceRequest['status']>();
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);

  useEffect(() => {
    fetchRequests();
  }, [user, isLandlord, isTenant]);

  const fetchRequests = async () => {
    if (!user) return;

    try {
      let q;
      if (isLandlord) {
        // Landlords see all requests for their properties
        q = query(
          collection(db, 'maintenanceRequests'),
          where('landlordId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
      } else {
        // Tenants only see their own requests
        q = query(
          collection(db, 'maintenanceRequests'),
          where('tenantId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
      }
      
      const snapshot = await getDocs(q);
      const requestData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MaintenanceRequest[];
      setRequests(requestData);
    } catch (error) {
      console.error('Error fetching maintenance requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    if (isLandlord) {
      setShowVendorAssignment(true);
    }
  };

  const filteredRequests = filter
    ? requests.filter(request => request.status === filter)
    : requests;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Maintenance Requests</h1>
          <p className="mt-2 text-sm text-gray-700">
            {isLandlord 
              ? 'Manage and track maintenance requests for your properties'
              : 'Submit and track maintenance requests for your property'}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex space-x-4">
          {isTenant && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </button>
          )}
          {isLandlord && (
            <button
              onClick={() => setShowSchedule(true)}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              <Clock className="h-4 w-4 mr-2" />
              View Schedule
            </button>
          )}
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center space-x-4 mb-6">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as MaintenanceRequest['status'])}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">All Requests</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="declined">Declined</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredRequests.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredRequests.map((request) => (
              <MaintenanceRequestCard
                key={request.id}
                request={request}
                onUpdate={fetchRequests}
                onAction={() => handleRequestAction(request)}
                isLandlord={isLandlord}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Wrench className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No maintenance requests</h3>
            <p className="mt-1 text-sm text-gray-500">
              {isTenant 
                ? 'Get started by creating a new maintenance request.'
                : 'No maintenance requests to display at this time.'}
            </p>
          </div>
        )}
      </div>

      {showForm && (
        <MaintenanceRequestForm
          onClose={() => setShowForm(false)}
          onSubmit={() => {
            setShowForm(false);
            fetchRequests();
          }}
        />
      )}

      {showVendorAssignment && selectedRequest && (
        <VendorAssignment
          request={selectedRequest}
          onClose={() => {
            setShowVendorAssignment(false);
            setSelectedRequest(null);
            fetchRequests();
          }}
        />
      )}

      {showSchedule && (
        <MaintenanceSchedule
          onClose={() => setShowSchedule(false)}
          requests={requests}
        />
      )}
    </div>
  );
}
