import { useState } from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { Property } from '../../types/property';

interface PropertySearchProps {
  onSearch: (filters: PropertyFilters) => void;
}

export interface PropertyFilters {
  search: string;
  priceRange: [number, number];
  bedrooms: number[];
  bathrooms: number[];
  propertyTypes: string[];
  amenities: string[];
  available: boolean | null;
}

export default function PropertySearch({ onSearch }: PropertySearchProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState<PropertyFilters>({
    search: '',
    priceRange: [0, 10000],
    bedrooms: [],
    bathrooms: [],
    propertyTypes: [],
    amenities: [],
    available: null,
  });

  const handleFilterChange = (key: keyof PropertyFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search properties..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <Filter className="h-5 w-5 mr-2" />
          Advanced Filters
        </button>
      </div>

      {showAdvanced && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Price Range</label>
            <div className="mt-1 flex items-center space-x-2">
              <input
                type="number"
                value={filters.priceRange[0]}
                onChange={(e) => handleFilterChange('priceRange', [Number(e.target.value), filters.priceRange[1]])}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <span>to</span>
              <input
                type="number"
                value={filters.priceRange[1]}
                onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], Number(e.target.value)])}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
            <div className="mt-1 flex items-center space-x-2">
              {[1, 2, 3, 4, '5+'].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    const value = typeof num === 'string' ? 5 : num;
                    const newBedrooms = filters.bedrooms.includes(value)
                      ? filters.bedrooms.filter(b => b !== value)
                      : [...filters.bedrooms, value];
                    handleFilterChange('bedrooms', newBedrooms);
                  }}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filters.bedrooms.includes(typeof num === 'string' ? 5 : num)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Property Type</label>
            <select
              multiple
              value={filters.propertyTypes}
              onChange={(e) => handleFilterChange('propertyTypes', 
                Array.from(e.target.selectedOptions, option => option.value)
              )}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Amenities</label>
            <div className="mt-1 space-y-2">
              {['Air Conditioning', 'Parking', 'Pool', 'Gym'].map((amenity) => (
                <label key={amenity} className="inline-flex items-center mr-4">
                  <input
                    type="checkbox"
                    checked={filters.amenities.includes(amenity)}
                    onChange={(e) => {
                      const newAmenities = e.target.checked
                        ? [...filters.amenities, amenity]
                        : filters.amenities.filter(a => a !== amenity);
                      handleFilterChange('amenities', newAmenities);
                    }}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Availability</label>
            <select
              value={filters.available === null ? '' : filters.available.toString()}
              onChange={(e) => handleFilterChange('available', 
                e.target.value === '' ? null : e.target.value === 'true'
              )}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">All</option>
              <option value="true">Available</option>
              <option value="false">Occupied</option>
            </select>
          </div>
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleSearch}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <SlidersHorizontal className="h-5 w-5 mr-2" />
          Apply Filters
        </button>
      </div>
    </div>
  );
}