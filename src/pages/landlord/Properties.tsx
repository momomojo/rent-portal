import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Property } from '../../types/property';
import { useAuthState } from '../../hooks/useAuthState';
import PropertySearch from '../../components/properties/PropertySearch';
import PropertyGallery from '../../components/properties/PropertyGallery';
import { Plus, Building } from 'lucide-react';
import PropertyForm from '../../components/PropertyForm';
import { toast } from 'sonner';

export default function LandlordProperties() {
  const { user } = useAuthState();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  useEffect(() => {
    if (user) {
      fetchProperties();
    }
  }, [user]);

  const fetchProperties = async () => {
    try {
      const q = query(
        collection(db, 'properties'),
        where('landlordId', '==', user?.uid)
      );
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Properties</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your rental properties
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </button>
        </div>
      </div>

      <div className="mt-8">
        <PropertySearch
          onSearch={(filters) => {
            // Implement property filtering
            console.log('Filters:', filters);
          }}
        />
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <div
            key={property.id}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="relative h-48">
              {property.images && property.images.length > 0 ? (
                <img
                  src={property.images[0]}
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <Building className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">{property.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{property.address}</p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Rent</span>
                  <p className="mt-1 text-lg font-medium text-gray-900">
                    ${property.rent}/month
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Status</span>
                  <p className="mt-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        property.available
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {property.available ? 'Available' : 'Occupied'}
                    </span>
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => setSelectedProperty(property)}
                  className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <PropertyForm
          onClose={() => setShowForm(false)}
          onSave={() => {
            setShowForm(false);
            fetchProperties();
          }}
        />
      )}

      {selectedProperty && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <PropertyGallery
                property={selectedProperty}
                onImagesUpdate={async () => {
                  // Implement image update logic
                }}
                editable={true}
              />
              <button
                onClick={() => setSelectedProperty(null)}
                className="mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}