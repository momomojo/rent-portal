import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Property } from '../../types/property';
import { toast } from 'sonner';
import { DollarSign, Settings, Calendar, AlertCircle } from 'lucide-react';
import RentSettingsForm from '../../components/RentSettingsForm';
import { useRoleAccess } from '../../hooks/useRoleAccess';
import { useAuthState } from '../../hooks/useAuthState';
import { useNavigate } from 'react-router-dom';

export default function RentManagement() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuthState();
  const { role, canManageRent, canViewAllProperties, loading: roleLoading } = useRoleAccess();
  const navigate = useNavigate();

  useEffect(() => {
    if (!roleLoading && !canManageRent) {
      navigate('/dashboard');
      toast.error('Unauthorized access');
      return;
    }
    
    if (user && role) {
      fetchProperties();
    }
  }, [user, role, roleLoading, canManageRent, navigate]);

  const fetchProperties = async () => {
    try {
      let q;
      if (canViewAllProperties) {
        q = query(collection(db, 'properties'));
      } else {
        q = query(collection(db, 'properties'), where('landlordId', '==', user?.uid));
      }

      const snapshot = await getDocs(q);
      const propertyData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Property[];
      setProperties(propertyData);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRent = async (propertyId: string, updates: Partial<Property>) => {
    try {
      const property = properties.find(p => p.id === propertyId);
      if (!property) throw new Error('Property not found');
      
      if (!canViewAllProperties && property.landlordId !== user?.uid) {
        throw new Error('Unauthorized to update this property');
      }

      await updateDoc(doc(db, 'properties', propertyId), {
        ...updates,
        updatedAt: Date.now()
      });
      
      toast.success('Rent settings updated successfully');
      fetchProperties();
    } catch (error) {
      console.error('Error updating rent settings:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update rent settings');
    }
  };

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Rent Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            {canViewAllProperties 
              ? 'Manage rent settings and payment schedules for all properties'
              : 'Manage rent settings for your properties'}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <div key={property.id} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">{property.name}</h3>
                <button
                  onClick={() => {
                    setSelectedProperty(property);
                    setShowSettings(true);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-500"
                >
                  <Settings className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500">
                    <DollarSign className="h-5 w-5 mr-2" />
                    <span>Base Rent</span>
                  </div>
                  <span className="font-medium">${property.rent}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>Payment Cycle</span>
                  </div>
                  <span className="font-medium capitalize">
                    {property.paymentCycle}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <span>Late Fee</span>
                  </div>
                  <span className="font-medium">
                    ${property.leaseTerms?.lateFeeAmount || 0}
                  </span>
                </div>

                {property.utilities && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Included Utilities</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(property.utilities)
                        .filter(([key, value]) => key !== 'costs' && value)
                        .map(([utility]) => (
                          <span
                            key={utility}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                          >
                            {utility.charAt(0).toUpperCase() + utility.slice(1)}
                          </span>
                        ))}
                    </div>
                  </div>
                )}

                {property.fees && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Additional Fees</h4>
                    <div className="space-y-2">
                      {property.fees.parking > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Parking</span>
                          <span>${property.fees.parking}</span>
                        </div>
                      )}
                      {property.fees.pet > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Pet</span>
                          <span>${property.fees.pet}</span>
                        </div>
                      )}
                      {property.fees.cleaning > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Cleaning</span>
                          <span>${property.fees.cleaning}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <button
                  onClick={() => {
                    setSelectedProperty(property);
                    setShowSettings(true);
                  }}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Manage Settings
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showSettings && selectedProperty && (
        <RentSettingsForm
          property={selectedProperty}
          onClose={() => {
            setShowSettings(false);
            setSelectedProperty(null);
          }}
          onSave={(updates) => {
            handleUpdateRent(selectedProperty.id, updates);
            setShowSettings(false);
            setSelectedProperty(null);
          }}
        />
      )}
    </div>
  );
}