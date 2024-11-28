import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { TenantApplication } from '../../types/application';
import ApplicationList from '../../components/applications/ApplicationList';
import ApplicationDetails from '../../components/applications/ApplicationDetails';
import { useAuthState } from '../../hooks/useAuthState';
import { toast } from 'sonner';
import { FileText, Filter } from 'lucide-react';

export default function Applications() {
  const [applications, setApplications] = useState<TenantApplication[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<TenantApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TenantApplication['status']>();
  const { user } = useAuthState();

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    try {
      const q = query(
        collection(db, 'applications'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const applicationData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TenantApplication[];
      setApplications(applicationData);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const filteredApplications = filter
    ? applications.filter(app => app.status === filter)
    : applications;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Tenant Applications</h1>
          <p className="mt-2 text-sm text-gray-700">
            Review and manage tenant applications
          </p>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center space-x-4 mb-6">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as TenantApplication['status'])}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">All Applications</option>
            <option value="pending">Pending</option>
            <option value="screening">Screening</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="waitlist">Waitlist</option>
          </select>
        </div>

        {filteredApplications.length > 0 ? (
          <div className="flex space-x-8">
            <div className="w-1/3">
              <ApplicationList
                applications={filteredApplications}
                selectedId={selectedApplication?.id}
                onSelect={setSelectedApplication}
              />
            </div>
            <div className="w-2/3">
              {selectedApplication ? (
                <ApplicationDetails
                  application={selectedApplication}
                  onUpdate={fetchApplications}
                />
              ) : (
                <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No application selected
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Select an application from the list to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No applications</h3>
            <p className="mt-1 text-sm text-gray-500">
              There are no tenant applications to review at this time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}