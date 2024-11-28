import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  FileText,
  Upload,
  Search,
  Filter,
  Share2,
  History,
  File,
  Download,
  Edit,
  Trash2,
} from 'lucide-react';
import { useDocuments } from '../hooks/useDocuments';
import { Document, DocumentType } from '../types/document';
import DocumentViewer from '../components/documents/DocumentViewer';
import DocumentUpload from '../components/documents/DocumentUpload';
import DocumentShare from '../components/documents/DocumentShare';
import DocumentHistory from '../components/documents/DocumentHistory';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function Documents() {
  const {
    documents,
    templates,
    loading,
    uploadDocument,
    createFromTemplate,
    shareDocument,
  } = useDocuments();

  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<DocumentType | ''>('');

  const filteredDocuments = documents.filter(doc =>
    (doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.metadata.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))) &&
    (filterType ? doc.type === filterType : true)
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Documents</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage and share your documents securely
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setShowUpload(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </button>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-10 pr-4 py-2"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <div className="w-48">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as DocumentType | '')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">All Types</option>
              <option value="lease">Leases</option>
              <option value="addendum">Addendums</option>
              <option value="notice">Notices</option>
              <option value="receipt">Receipts</option>
              <option value="application">Applications</option>
              <option value="inspection">Inspections</option>
              <option value="maintenance">Maintenance</option>
              <option value="template">Templates</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {filteredDocuments.length > 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
              {filteredDocuments.map((document) => (
                <li key={document.id}>
                  <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div className="ml-4">
                          <h3 className="text-sm font-medium text-gray-900">
                            {document.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {format(document.updatedAt, 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => setSelectedDocument(document)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <File className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedDocument(document);
                            setShowShare(true);
                          }}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <Share2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedDocument(document);
                            setShowHistory(true);
                          }}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <History className="h-5 w-5" />
                        </button>
                        <a
                          href={document.url}
                          download={document.name}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <Download className="h-5 w-5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No documents</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by uploading a new document.
            </p>
          </div>
        )}
      </div>

      {showUpload && (
        <DocumentUpload
          onClose={() => setShowUpload(false)}
          templates={templates}
          onUpload={uploadDocument}
          onCreateFromTemplate={createFromTemplate}
        />
      )}

      {selectedDocument && showShare && (
        <DocumentShare
          document={selectedDocument}
          onClose={() => {
            setShowShare(false);
            setSelectedDocument(null);
          }}
          onShare={shareDocument}
        />
      )}

      {selectedDocument && showHistory && (
        <DocumentHistory
          document={selectedDocument}
          onClose={() => {
            setShowHistory(false);
            setSelectedDocument(null);
          }}
        />
      )}

      {selectedDocument && !showShare && !showHistory && (
        <DocumentViewer
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </div>
  );
}