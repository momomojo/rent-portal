import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Users as UserPlus,
  DollarSign,
  BarChart,
  Building,
  Wrench,
  AlertCircle,
  TrendingUp,
  UserCheck,
  Clock
} from 'lucide-react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Property } from '../../types/property';
import { MaintenanceRequest } from '../../types/maintenance';
import { Payment } from '../../types/payment';
import { toast } from 'sonner';

interface DashboardMetric {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: any;
  color: string;
}

interface RecentActivity {
  id: string;
  type: 'property' | 'maintenance' | 'payment' | 'tenant';
  title: string;
  description: string;
  timestamp: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [pendingActions, setPendingActions] = useState<number>(0);

  const quickActions = [
    {
      title: 'Add Property',
      icon: Home,
      onClick: () => navigate('/admin/properties'),
      color: 'bg-blue-100 text-blue-800'
    },
    {
      title: 'Manage Tenants',
      icon: UserPlus,
      onClick: () => navigate('/admin/tenants'),
      color: 'bg-green-100 text-green-800'
    },
    {
      title: 'Rent Settings',
      icon: DollarSign,
      onClick: () => navigate('/admin/rent'),
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      title: 'View Reports',
      icon: BarChart,
      onClick: () => navigate('/admin/reports'),
      color: 'bg-purple-100 text-purple-800'
    }
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch properties
        const propertiesQuery = query(collection(db, 'properties'));
        const propertiesSnapshot = await getDocs(propertiesQuery);
        const properties = propertiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Property[];

        // Fetch maintenance requests
        const maintenanceQuery = query(
          collection(db, 'maintenance'),
          where('status', '==', 'pending'),
          orderBy('createdAt', 'desc')
        );
        const maintenanceSnapshot = await getDocs(maintenanceQuery);
        const maintenance = maintenanceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as MaintenanceRequest[];

        // Fetch recent payments
        const paymentsQuery = query(
          collection(db, 'payments'),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const paymentsSnapshot = await getDocs(paymentsQuery);
        const payments = paymentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Payment[];

        // Calculate metrics
        const occupancyRate = properties.length > 0
          ? (properties.filter(p => !p.available).length / properties.length * 100).toFixed(1)
          : 0;

        const monthlyRevenue = payments
          .filter(p => p.status === 'paid' && p.createdAt > Date.now() - 30 * 24 * 60 * 60 * 1000)
          .reduce((sum, p) => sum + p.amount, 0);

        setMetrics([
          {
            label: 'Total Properties',
            value: properties.length,
            icon: Building,
            color: 'text-blue-600'
          },
          {
            label: 'Occupancy Rate',
            value: `${occupancyRate}%`,
            trend: 'up',
            icon: TrendingUp,
            color: 'text-green-600'
          },
          {
            label: 'Active Tenants',
            value: properties.filter(p => !p.available).length,
            icon: UserCheck,
            color: 'text-purple-600'
          },
          {
            label: 'Monthly Revenue',
            value: `$${monthlyRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: 'text-yellow-600'
          }
        ]);

        // Set pending actions
        setPendingActions(maintenance.length);

        // Combine and sort recent activity
        const activity: RecentActivity[] = [
          ...maintenance.map(m => ({
            id: m.id,
            type: 'maintenance' as const,
            title: 'New Maintenance Request',
            description: m.description,
            timestamp: m.createdAt
          })),
          ...payments.map(p => ({
            id: p.id,
            type: 'payment' as const,
            title: 'Payment Received',
            description: `$${p.amount} for property ${p.propertyId}`,
            timestamp: p.createdAt
          }))
        ].sort((a, b) => b.timestamp - a.timestamp);

        setRecentActivity(activity.slice(0, 5));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <button
              key={action.title}
              onClick={action.onClick}
              className={`p-4 rounded-lg flex items-center space-x-3 transition-colors ${action.color} hover:opacity-90`}
            >
              <action.icon className="h-6 w-6" />
              <span className="font-medium">{action.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Overview</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <metric.icon className={`h-8 w-8 ${metric.color}`} />
                {metric.trend && (
                  <span className={`text-sm ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.trend === 'up' ? '↑' : '↓'} {metric.change}
                  </span>
                )}
              </div>
              <p className="mt-4 text-2xl font-semibold text-gray-900">{metric.value}</p>
              <p className="text-sm text-gray-500">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Actions */}
        {pendingActions > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Pending Actions</h2>
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <Wrench className="h-5 w-5 text-yellow-500 mr-2" />
                <span className="text-sm text-yellow-700">
                  {pendingActions} maintenance {pendingActions === 1 ? 'request' : 'requests'} pending
                </span>
              </div>
              <button
                onClick={() => navigate('/admin/maintenance')}
                className="text-sm text-yellow-700 hover:text-yellow-900 font-medium"
              >
                View All →
              </button>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`mt-1 rounded-full p-1 ${
                  activity.type === 'maintenance' ? 'bg-yellow-100' :
                  activity.type === 'payment' ? 'bg-green-100' :
                  activity.type === 'tenant' ? 'bg-blue-100' :
                  'bg-gray-100'
                }`}>
                  {activity.type === 'maintenance' && <Wrench className="h-4 w-4 text-yellow-600" />}
                  {activity.type === 'payment' && <DollarSign className="h-4 w-4 text-green-600" />}
                  {activity.type === 'tenant' && <UserPlus className="h-4 w-4 text-blue-600" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
