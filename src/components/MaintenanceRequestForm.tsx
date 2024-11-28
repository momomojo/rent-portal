import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { useAuthState } from '../hooks/useAuthState';
import { MaintenanceRequest, MaintenanceCategory } from '../types/maintenance';
import { X, Upload, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface MaintenanceRequestFormProps {
  onClose: () => void;
  onSubmit: () => void;
}

const CATEGORIES: MaintenanceCategory[] = [
  'plumbing',
  'electrical',
  'hvac',
  'appliance',
  'structural',
  'pest',
  'cleaning',
  'other',
];

export default function MaintenanceRequestForm({ onClose, onSubmit }: MaintenanceRequestFormProps) {
  const { user } = useAuthState();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as MaintenanceRequest['priority'],
    category: 'other' as MaintenanceCategory,
    images: [] as string[],
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
    maxFiles: 5,
    onDrop: async (acceptedFiles) => {
      try {
        const uploadPromises = acceptedFiles.map(async (file) => {
          const imageRef = ref(storage, `maintenance/${uuidv4()}`);
          await uploadBytes(imageRef, file);
          return getDownloadURL(imageRef);
        });

        const urls = await Promise.all(uploadPromises);
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...urls],
        }));
      } catch (error) {
        console.error('Error uploading images:', error);
        toast.error('Failed to upload images');
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'maintenanceRequests'), {
        ...formData,
        tenantId: user.uid,
        status: 'pending',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      toast.success('Maintenance request submitted successfully');
      onSubmit();
    } catch (error) {
      console.error('Error submitting maintenance request:', error);
      toast.error('Failed to submit maintenance request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              New Maintenance Request
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as MaintenanceCategory })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as MaintenanceRequest['priority'] })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Images
              </label>
              <div
                {...getRootProps()}
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
              >
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <input {...getInputProps()} />
                    <p>Drag & drop images here, or click to select files</p>
                  </div>
                </div>
              </div>
              {formData.images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {formData.images.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt=""
                        className="h-24 w-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({
                          ...formData,
                          images: formData.images.filter((_, i) => i !== index),
                        })}
                        className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-100 rounded-full p-1"
                      >
                        <X className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {formData.priority === 'emergency' && (
              <div className="rounded-md bg-yellow-50 p-4">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Emergency Request
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        For emergencies that pose immediate danger or severe property damage,
                        please also contact emergency services if necessary.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}