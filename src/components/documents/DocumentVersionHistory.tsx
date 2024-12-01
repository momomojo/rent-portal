import { format } from 'date-fns';
import { History, Download } from 'lucide-react';
import { Document, DocumentVersion } from '../../types/document';

interface DocumentVersionHistoryProps {
  document: Document;
  onClose: () => void;
}

export default function DocumentVersionHistory({ document, onClose }: DocumentVersionHistoryProps) {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Version History</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            {/* Current Version */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Current Version</p>
                  <p className="text-sm text-gray-500">
                    Updated {format(document.updatedAt, 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
                <a
                  href={document.url}
                  download={document.name}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </a>
              </div>
            </div>

            {/* Previous Versions */}
            {document.previousVersions?.map((version: DocumentVersion) => (
              <div key={version.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Version {version.version}</p>
                    <p className="text-sm text-gray-500">
                      {format(version.createdAt, 'MMM d, yyyy h:mm a')}
                    </p>
                    {version.changes && (
                      <p className="text-sm text-gray-600 mt-1">
                        Changes: {version.changes}
                      </p>
                    )}
                  </div>
                  <a
                    href={version.url}
                    download={`${document.name}_v${version.version}`}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}