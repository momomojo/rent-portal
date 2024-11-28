import { useState } from 'react';
import ReactCompareImage from 'react-compare-image';
import { Property } from '../../types/property';
import { ArrowLeftRight, Check, X } from 'lucide-react';

interface PropertyComparisonProps {
  properties: Property[];
  onClose: () => void;
}

export default function PropertyComparison({ properties, onClose }: PropertyComparisonProps) {
  const [selectedProperties, setSelectedProperties] = useState<[Property, Property]>([properties[0], properties[1]]);

  const formatAmenities = (amenities: string[]) => {
    return amenities.sort().map((amenity, index) => (
      <div key={index} className="flex items-center space-x-2">
        <Check className="h-4 w-4 text-green-500" />
        <span>{amenity}</span>
      </div>
    ));
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">Compare Properties</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {[0, 1].map((index) => (
              <div key={index}>
                <select
                  value={selectedProperties[index].id}
                  onChange={(e) => {
                    const property = properties.find(p => p.id === e.target.value);
                    if (property) {
                      const newProperties = [...selectedProperties] as [Property, Property];
                      newProperties[index] = property;
                      setSelectedProperties(newProperties);
                    }
                  }}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  {properties.map((property) => (
                    <option key={property.id} value={property.id}>
                      {property.name}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="mt-6">
            {selectedProperties[0].images[0] && selectedProperties[1].images[0] && (
              <div className="aspect-w-16 aspect-h-9 mb-6">
                <ReactCompareImage
                  leftImage={selectedProperties[0].images[0]}
                  rightImage={selectedProperties[1].images[0]}
                  sliderPositionPercentage={0.5}
                  sliderLineWidth={2}
                  sliderLineColor="#4F46E5"
                  handle={
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                      <ArrowLeftRight className="h-4 w-4 text-white" />
                    </div>
                  }
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-8">
              {selectedProperties.map((property, index) => (
                <div key={index} className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900">{property.name}</h4>
                    <p className="text-gray-500">{property.address}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Price</span>
                      <p className="text-lg font-medium text-gray-900">${property.rent}/month</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Size</span>
                      <p className="text-lg font-medium text-gray-900">{property.squareFeet} sq ft</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Bedrooms</span>
                      <p className="text-lg font-medium text-gray-900">{property.bedrooms}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Bathrooms</span>
                      <p className="text-lg font-medium text-gray-900">{property.bathrooms}</p>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Amenities</h5>
                    <div className="space-y-2">
                      {formatAmenities(property.amenities)}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Utilities Included</h5>
                    <div className="space-y-2">
                      {Object.entries(property.utilities)
                        .filter(([key, value]) => key !== 'costs' && value)
                        .map(([utility]) => (
                          <div key={utility} className="flex items-center space-x-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="capitalize">{utility}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}