import { useState } from 'react';
import { useProperties } from '../../hooks/useProperties';
import PropertySearch from '../../components/properties/PropertySearch';
import PropertyCard from '../../components/properties/PropertyCard';
import PropertyForm from '../../components/PropertyForm';
import PropertyComparison from '../../components/properties/PropertyComparison';
import PropertyBulkActions from '../../components/properties/PropertyBulkActions';
import { Plus, Building } from 'lucide-react';
import { toast } from 'sonner';
import type { Property } from '../../types/property';
import type { PropertyFilters } from '../../components/properties/PropertySearch';

export default function Properties() {
  const { properties, loading, addProperty, updateProperty, deleteProperty, uploadPropertyImages } = useProperties();
  const [showForm, setShowForm] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(properties);

  const handleSearch = (filters: PropertyFilters) => {
    const filtered = properties.filter(property => {
      const matchesSearch = !filters.search || 
        property.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        property.address.toLowerCase().includes(filters.search.toLowerCase());

      const matchesPrice = property.rent >= filters.priceRange[0] && 
        property.rent <= filters.priceRange[1];

      const matchesBedrooms = filters.bedrooms.length === 0 || 
        filters.bedrooms.includes(property.bedrooms);

      const matchesType = filters.propertyTypes.length === 0 || 
        filters.propertyTypes.includes(property.type);

      const matchesAmenities = filters.amenities.length === 0 || 
        filters.amenities.every(amenity => property.amenities.includes(amenity));

      const matchesAvailability = filters.available === null || 
        property.available === filters.available;

      return matchesSearch && matchesPrice && matchesBedrooms && 
        matchesType && matchesAmenities && matchesAvailability;
    });

    setFilteredProperties(filtered);
  };

  const handlePropertySelect = (property: Property) => {
    setSelectedProperties(prev => {
      if (prev.find(p => p.id === property.id)) {
        return prev.filter(p => p.id !== property.id);
      }
      if (prev.length < 2) {
        return [...prev, property];
      }
      return prev;
    });
  };

  const handleBulkImport = async (properties: Partial<Property>[]) => {
    try {
      for (const property of properties) {
        await addProperty(property as Omit<Property, 'id' | 'createdAt' | 'updatedAt'>);
      }
      toast.success(`${properties.length} properties imported successfully`);
    } catch (error) {
      console.error('Error importing properties:', error);
      toast.error('Failed to import properties');
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
          <h1 className="text-2xl font-semibold text-gray-900">Properties</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage and organize your rental properties
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:flex space-x-3">
          <button
            onClick={() => setShowComparison(true)}
            disabled={selectedProperties.length !== 2}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Compare Selected ({selectedProperties.length}/2)
          </button>
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
        <PropertyBulkActions
          onImport={handleBulkImport}
          onExport={async () => properties}
        />
      </div>

      <div className="mt-8">
        <PropertySearch onSearch={handleSearch} />
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProperties.map((property) => (
          <div
            key={property.id}
            onClick={() => handlePropertySelect(property)}
            className={`cursor-pointer transition-transform transform hover:scale-105 ${
              selectedProperties.find(p => p.id === property.id)
                ? 'ring-2 ring-indigo-500'
                : ''
            }`}
          >
            <PropertyCard
              property={property}
              onEdit={() => {
                setShowForm(true);
                // Add edit logic
              }}
              onDelete={async () => {
                if (window.confirm('Are you sure you want to delete this property?')) {
                  await deleteProperty(property.id);
                }
              }}
            />
          </div>
        ))}
      </div>

      {showForm && (
        <PropertyForm
          onClose={() => setShowForm(false)}
          onSave={() => {
            setShowForm(false);
            // Add save logic
          }}
        />
      )}

      {showComparison && selectedProperties.length === 2 && (
        <PropertyComparison
          properties={selectedProperties}
          onClose={() => {
            setShowComparison(false);
            setSelectedProperties([]);
          }}
        />
      )}
    </div>
  );
}