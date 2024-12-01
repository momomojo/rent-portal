import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  CreditCard,
  DollarSign,
  Clock,
  CheckCircle,
  Building,
  Users,
  Wrench,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from '../hooks/useAuthState';
import { useRoleAccess } from '../hooks/useRoleAccess';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { Payment } from '../types/payment';
import { Property } from '../types/property';
import { MaintenanceRequest } from '../types/maintenance';
import { toast } from 'sonner';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthState();
  const { isLandlord } = useRoleAccess();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        // Fetch payments
        const paymentsQuery = query(
          collection(db, 'payments'),
          where(isLandlord ? 'propertyId' : 'tenantId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const paymentsSnapshot = await getDocs(paymentsQuery);
        const paymentData = paymentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Payment[];
        setPayments(paymentData);

        if (isLandlord) {
          // Fetch properties for landlord
          const propertiesQuery = query(
            collection(db, 'properties'),
            where('landlordId', '==', user.uid)
          );
          const propertiesSnapshot = await getDocs(propertiesQuery);
          const propertyData = propertiesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Property[];
          setProperties(propertyData);

          // Fetch maintenance requests for landlord's properties
          const maintenanceQuery = query(
            collection(db, 'maintenance'),
            where('status', '==', 'pending'),
            where('propertyId', 'in', propertyData.map(p => p.id))
          );
          const maintenanceSnapshot = await getDocs(maintenanceQuery);
          const maintenanceData = maintenanceSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as MaintenanceRequest[];
          setMaintenanceRequests(maintenanceData);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, isLandlord]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (isLandlord) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Landlord Overview */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <Building className="h-6 w-6 text-gray-400" />
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Properties
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {properties.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <Users className="h-6 w-6 text-gray-400" />
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Active Tenants
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {properties.filter(p => !p.available).length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <Wrench className="h-6 w-6 text-gray-400" />
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Pending Maintenance
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {maintenanceRequests.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <button
              onClick={() => navigate('/landlord/properties')}
              className="p-4 rounded-lg bg-blue-100 text-blue-800 flex items-center space-x-3 hover:bg-blue-200"
            >
              <Building className="h-6 w-6" />
              <span className="font-medium">Manage Properties</span>
            </button>
            <button
              onClick={() => navigate('/landlord/maintenance')}
              className="p-4 rounded-lg bg-yellow-100 text-yellow-800 flex items-center space-x-3 hover:bg-yellow-200"
            >
              <Wrench className="h-6 w-6" />
              <span className="font-medium">View Maintenance Requests</span>
            </button>
            <button
              onClick={() => navigate('/landlord/documents')}
              className="p-4 rounded-lg bg-green-100 text-green-800 flex items-center space-x-3 hover:bg-green-200"
            >
              <DollarSign className="h-6 w-6" />
              <span className="font-medium">View Payments</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tenant Dashboard
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <DollarSign className="h-6 w-6 text-gray-400" />
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Next Payment Due
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ${payments[0]?.amount || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <Clock className="h-6 w-6 text-gray-400" />
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Due Date
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {payments[0]?.dueDate ? format(payments[0].dueDate, 'MMM dd, yyyy') : 'N/A'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <CreditCard className="h-6 w-6 text-gray-400" />
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Payment Method
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {payments[0]?.paymentMethod || 'Not set'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-gray-400" />
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Payment Status
                  </dt>
                  <dd className={`text-lg font-medium ${
                    payments[0]?.status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {payments[0]?.status || 'No payments'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Payment History
            </h3>
          </div>
          <div className="border-t border-gray-200">
            <div className="bg-white px-4 py-5 sm:p-6">
              <div className="flow-root">
                <ul role="list" className="-my-5 divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <li key={payment.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            Payment - {format(payment.createdAt, 'MMM dd, yyyy')}
                          </p>
                          <p className="text-sm text-gray-500">
                            Status: {payment.status}
                          </p>
                        </div>
                        <div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ${payment.amount}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
