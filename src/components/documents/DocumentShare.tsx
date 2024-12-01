import { useState } from 'react';
import { Users, X } from 'lucide-react';
import { Document } from '../../types/document';

interface DocumentShareProps {
  document: Document;
  onClose: () => void;
  onShare: (documentId: string, userIds: string[]) => Promise<void>;
}

export default function DocumentShare({ document, onClose, onShare }: DocumentShareProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>(document.sharedWith || []);
  const [loading, setLoading] = useState(false);

  const handleShare = async () => {
    setLoading(true);
    try {
      await onShare(document.id, selectedUsers);
      onClose();
    } catch (error) {
      console.error('Error sharing document:', error);
    } finally {
      setLoading(false);
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
                Share with Users
              </label>
              <div className="mt-2 space-y-2">
                {/* User selection would be implemented here */}
                <p className="text-sm text-gray-500">
                  Select users to share this document with
                </p>
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
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Sharing...' : 'Share'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}