import { useState, useRef } from 'react';
import { User, Building, Phone, Mail, Camera, Cog } from 'lucide-react';
import { useAuthState } from '../hooks/useAuthState';
import { storage, db } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import NotificationPreferences from '../components/profile/NotificationPreferences';
import SecuritySettings from '../components/profile/SecuritySettings';
import { v4 as uuidv4 } from 'uuid';

export default function Profile() {
  const { user } = useAuthState();
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    avatar: user?.photoURL || '',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    preferences: {
      language: 'en',
      timezone: 'UTC',
      currency: 'USD'
    }
  });

  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile');

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const imageRef = ref(storage, `avatars/${user.uid}/${uuidv4()}`);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);

      await updateDoc(doc(db, 'users', user.uid), {
        avatar: url
      });

      setFormData(prev => ({ ...prev, avatar: url }));
      toast.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to update profile picture');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        preferences: formData.preferences,
        updatedAt: Date.now()
      });

      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Profile Settings</h3>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'profile'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <User className="h-5 w-5" />
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'notifications'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Mail className="h-5 w-5" />
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'security'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Cog className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200">
          {activeTab === 'profile' && (
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center space-x-8">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100">
                    {formData.avatar ? (
                      <img
                        src={formData.avatar}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <User className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50"
                  >
                    <Camera className="h-4 w-4 text-gray-600" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>

                {isEditing ? (
                  <form onSubmit={handleSubmit} className="flex-1 space-y-4">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Full name
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Email address
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          disabled
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 sm:text-sm"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Phone number
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="col-span-6">
                        <label className="block text-sm font-medium text-gray-700">
                          Address
                        </label>
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Language
                        </label>
                        <select
                          value={formData.preferences.language}
                          onChange={(e) => setFormData({
                            ...formData,
                            preferences: { ...formData.preferences, language: e.target.value }
                          })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                        </select>
                      </div>

                      <div className="col-span-6 sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Timezone
                        </label>
                        <select
                          value={formData.preferences.timezone}
                          onChange={(e) => setFormData({
                            ...formData,
                            preferences: { ...formData.preferences, timezone: e.target.value }
                          })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="UTC">UTC</option>
                          <option value="America/New_York">Eastern Time</option>
                          <option value="America/Chicago">Central Time</option>
                          <option value="America/Denver">Mountain Time</option>
                          <option value="America/Los_Angeles">Pacific Time</option>
                        </select>
                      </div>

                      <div className="col-span-6 sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Currency
                        </label>
                        <select
                          value={formData.preferences.currency}
                          onChange={(e) => setFormData({
                            ...formData,
                            preferences: { ...formData.preferences, currency: e.target.value }
                          })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex-1">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500 flex items-center">
                          <User className="h-5 w-5 mr-2" />
                          Full Name
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">{formData.name}</dd>
                      </div>

                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500 flex items-center">
                          <Mail className="h-5 w-5 mr-2" />
                          Email
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">{formData.email}</dd>
                      </div>

                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500 flex items-center">
                          <Phone className="h-5 w-5 mr-2" />
                          Phone
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">{formData.phone}</dd>
                      </div>

                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500 flex items-center">
                          <Building className="h-5 w-5 mr-2" />
                          Address
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">{formData.address}</dd>
                      </div>
                    </dl>

                    <div className="mt-6">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Edit Profile
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <NotificationPreferences
              preferences={formData.notifications}
              onUpdate={(notifications) => setFormData(prev => ({ ...prev, notifications }))}
            />
          )}

          {activeTab === 'security' && (
            <SecuritySettings />
          )}
        </div>
      </div>
    </div>
  );
}