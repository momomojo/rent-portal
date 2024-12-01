import { useState } from 'react';
import { X, Download, Edit, History } from 'lucide-react';
import { Document } from '../../types/document';
import { useDocuments } from '../../hooks/useDocuments';
import SignatureCanvas from '../SignatureCanvas';
import { format } from 'date-fns';

interface DocumentViewerProps {
  document: Document;
  onClose: () => void;
}

export default function DocumentViewer({ document, onClose }: DocumentViewerProps) {
  const { signDocument } = useDocuments();
  const [showSignature, setShowSignature] = useState(false);
  const [signature, setSignature] = useState('');

  const handleSign = async () => {
    if (!signature) {
      return;
    }

    try {
      await signDocument(document.id, signature, '127.0.0.1'); // In production, get real IP
      onClose();
    } catch (error) {
      console.error('Error signing document:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">{document.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {showSignature ? (
            <div className="space-y-4">
              <SignatureCanvas onChange={setSignature} />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowSignature(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSign}
                  disabled={!signature}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  Sign Document
                </button>
              </div>
            </div>
          ) : (
            <iframe
              src={document.url}
              className="w-full h-full min-h-[60vh]"
              title={document.name}
            />
          )}
        </div>

        <div className="px-4 py-3 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Last updated: {format(document.updatedAt, 'MMM d, yyyy')}
          </div>
          <div className="flex space-x-3">
            {document.status === 'pending_signature' && (
              <button
                onClick={() => setShowSignature(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Sign Document
              </button>
            )}
            <a
              href={document.url}
              download={document.name}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}