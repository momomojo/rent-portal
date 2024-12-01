import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload } from 'lucide-react';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { Property } from '../types/property';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface PropertyFormProps {
  property?: Property | null;
  onClose: () => void;
  onSave: () => void;
}

const PROPERTY_TYPES = ['apartment', 'house', 'condo', 'townhouse'];
const AMENITIES = [
  'Air Conditioning',
  'Heating',
  'Washer/Dryer',
  'Parking',
  'Gym',
  'Pool',
  'Pet Friendly',
  'Furnished',
  'Balcony',
  'Storage',
];

export default function PropertyForm({ property, onClose, onSave }: PropertyFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Property>>(
    property || {
      name: '',
      description: '',
      address: '',
      type: 'apartment',
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: 0,
      rent: 0,
      deposit: 0,
      available: true,
      images: [],
      amenities: [],
    }
  );

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setLoading(true);
    try {
      const uploadPromises = acceptedFiles.map(async (file) => {
        const imageRef = ref(storage, `properties/${uuidv4()}`);
        await uploadBytes(imageRef, file);
        return getDownloadURL(imageRef);
      });

      const urls = await Promise.all(uploadPromises);
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...urls],
      }));
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
    } finally {
      setLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
    maxFiles: 5,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (property?.id) {
        await updateDoc(doc(db, 'properties', property.id), {
          ...formData,
          updatedAt: Date.now(),
        });
        toast.success('Property updated successfully');
      } else {
        await addDoc(collection(db, 'properties'), {
          ...formData,
          id: uuidv4(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
        toast.success('Property created successfully');
      }
      onSave();
    } catch (error) {
      console.error('Error saving property:', error);
      toast.error('Failed to save property');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index),
    }));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities?.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...(prev.amenities || []), amenity],
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {property ? 'Edit Property' : 'Add New Property'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Property Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  required
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Property Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  {PROPERTY_TYPES.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">
                  Bedrooms
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  id="bedrooms"
                  min="0"
                  required
                  value={formData.bedrooms}
                  onChange={e => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">
                  Bathrooms
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  id="bathrooms"
                  min="0"
                  step="0.5"
                  required
                  value={formData.bathrooms}
                  onChange={e => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="squareFeet" className="block text-sm font-medium text-gray-700">
                  Square Feet
                </label>
                <input
                  type="number"
                  name="squareFeet"
                  id="squareFeet"
                  min="0"
                  required
                  value={formData.squareFeet}
                  onChange={e => setFormData({ ...formData, squareFeet: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="rent" className="block text-sm font-medium text-gray-700">
                  Monthly Rent
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    name="rent"
                    id="rent"
                    min="0"
                    required
                    value={formData.rent}
                    onChange={e => setFormData({ ...formData, rent: Number(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-7"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="deposit" className="block text-sm font-medium text-gray-700">
                  Security Deposit
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    name="deposit"
                    id="deposit"
                    min="0"
                    required
                    value={formData.deposit}
                    onChange={e => setFormData({ ...formData, deposit: Number(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-7"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700">Amenities</label>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {AMENITIES.map(amenity => (
                    <label
                      key={amenity}
                      className="relative flex items-start py-2"
                    >
                      <div className="min-w-0 flex-1 text-sm">
                        <input
                          type="checkbox"
                          checked={formData.amenities?.includes(amenity)}
                          onChange={() => toggleAmenity(amenity)}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-2"
                        />
                        {amenity}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700">Images</label>
                <div
                  {...getRootProps()}
                  className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md ${
                    isDragActive ? 'border-indigo-500' : ''
                  }`}
                >
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <input {...getInputProps()} />
                      <p>Drag & drop images here, or click to select files</p>
                    </div>
                  </div>
                </div>
                {formData.images && formData.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt=""
                          className="h-24 w-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-100 rounded-full p-1"
                        >
                          <X className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="sm:col-span-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.available}
                    onChange={e => setFormData({ ...formData, available: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Available for rent
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}