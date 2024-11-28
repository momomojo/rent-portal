import { Building, Edit, Trash2, Users } from 'lucide-react';
import { Property } from '../../types/property';
import { useRoleAccess } from '../../hooks/useRoleAccess';
import { format } from 'date-fns';

interface PropertyCardProps {
  property: Property;
  onEdit?: () => void;
  onDelete?: () => void;
  onAssignTenant?: () => void;
}

export default function PropertyCard({ property, onEdit, onDelete, onAssignTenant }: PropertyCardProps) {
  const { canEditProperty, canAssignTenants } = useRoleAccess();

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
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
        {canEditProperty && (
          <div className="absolute top-2 right-2 space-x-2">
            <button
              onClick={onEdit}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
            >
              <Edit className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </button>
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
          <div>
            <span className="text-sm font-medium text-gray-500">Size</span>
            <p className="mt-1 text-sm text-gray-900">
              {property.squareFeet} sq ft
            </p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Type</span>
            <p className="mt-1 text-sm text-gray-900 capitalize">
              {property.type}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <span className="text-sm font-medium text-gray-500">Amenities</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {property.amenities.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
              >
                {amenity}
              </span>
            ))}
            {property.amenities.length > 3 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                +{property.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>
        {canAssignTenants && property.available && (
          <div className="mt-6">
            <button
              onClick={onAssignTenant}
              className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Users className="h-4 w-4 mr-2" />
              Assign Tenant
            </button>
          </div>
        )}
      </div>
    </div>
  );
}