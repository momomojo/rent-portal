import { useState } from 'react';
import { Users, X } from 'lucide-react';
import { Document } from '../../types/document';
import { useDocuments } from '../../hooks/useDocuments';

interface DocumentShareDialogProps {
  document: Document;
  onClose: () => void;
}

export default function DocumentShareDialog({ document, onClose }: DocumentShareDialogProps) {
  const { shareDocument } = useDocuments();
  const [selectedUsers, setSelectedUsers] = useState<string[]>(document.sharedWith || []);
  const [searchTerm, setSearchTerm] = useState('');

  const handleShare = async () => {
    try {
      await shareDocument(document.id, selectedUsers);
      onClose();
    } catch (error) {
      console.error('Error sharing document:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Share Document</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Search Users
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search by name or email"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="border rounded-md max-h-60 overflow-y-auto">
              {/* User list would be populated here */}
              <div className="p-2 space-y-2">
                {/* Example user item */}
                <label className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-900">User Name</span>
                </label>
              </div>
            </div>

            <div className="mt-5 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}