import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText } from 'lucide-react';
import { Document, DocumentType } from '../../types/document';

interface DocumentUploadProps {
  templates: Document[];
  onClose: () => void;
  onUpload: (file: File, type: DocumentType, metadata: any) => Promise<string>;
  onCreateFromTemplate: (templateId: string, name: string, metadata: any) => Promise<void>;
}

export default function DocumentUpload({
  templates,
  onClose,
  onUpload,
  onCreateFromTemplate
}: DocumentUploadProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [documentType, setDocumentType] = useState<DocumentType>('other');
  const [loading, setLoading] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;
      
      setLoading(true);
      try {
        await onUpload(acceptedFiles[0], documentType, {
          description: '',
          keywords: [],
          isTemplate: false
        });
        onClose();
      } catch (error) {
        console.error('Error uploading document:', error);
      } finally {
        setLoading(false);
      }
    }
  });

  const handleCreateFromTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate || !documentName) return;

    setLoading(true);
    try {
      await onCreateFromTemplate(selectedTemplate, documentName, {
        description: '',
        keywords: [],
        isTemplate: false
      });
      onClose();
    } catch (error) {
      console.error('Error creating from template:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Upload Document</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Document Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Document Type
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value as DocumentType)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="lease">Lease Agreement</option>
                <option value="addendum">Addendum</option>
                <option value="notice">Notice</option>
                <option value="receipt">Receipt</option>
                <option value="application">Application</option>
                <option value="inspection">Inspection</option>
                <option value="maintenance">Maintenance</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Template Selection */}
            {templates.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Use Template
                </label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select a template</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedTemplate ? (
              <form onSubmit={handleCreateFromTemplate}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Document Name
                  </label>
                  <input
                    type="text"
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Create Document'}
                  </button>
                </div>
              </form>
            ) : (
              <div
                {...getRootProps()}
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
              >
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <input {...getInputProps()} />
                    <p>Drag & drop a file here, or click to select one</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, or DOCX up to 10MB
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}