import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { Document, DocumentType } from '../../types/document';
import { useDocuments } from '../../hooks/useDocuments';
import SignatureCanvas from '../SignatureCanvas';

interface DocumentTemplateFormProps {
  onClose: () => void;
  onSave: (template: Partial<Document>) => void;
  template?: Document;
}

export default function DocumentTemplateForm({ onClose, onSave, template }: DocumentTemplateFormProps) {
  const [formData, setFormData] = useState({
    name: template?.name || '',
    type: template?.type || 'lease' as DocumentType,
    category: template?.category || 'contracts',
    description: template?.metadata?.description || '',
    variables: template?.metadata?.variables || [],
    requiredSignatures: template?.metadata?.requiredSignatures || []
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      // Handle file upload
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      metadata: {
        isTemplate: true,
        description: formData.description,
        variables: formData.variables,
        requiredSignatures: formData.requiredSignatures
      }
    });
  };

  const addVariable = () => {
    const variable = prompt('Enter variable name (e.g., {{tenant_name}})');
    if (variable) {
      setFormData(prev => ({
        ...prev,
        variables: [...prev.variables, variable]
      }));
    }
  };

  const addSignatureRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requiredSignatures: [
        ...prev.requiredSignatures,
        { role: 'tenant', signed: false }
      ]
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              {template ? 'Edit Template' : 'Create Template'}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Template Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Document Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as DocumentType }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="lease">Lease Agreement</option>
              <option value="addendum">Addendum</option>
              <option value="notice">Notice</option>
              <option value="application">Application</option>
              <option value="inspection">Inspection Report</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Template Variables
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.variables.map((variable, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  {variable}
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      variables: prev.variables.filter((_, i) => i !== index)
                    }))}
                    className="ml-1 text-indigo-600 hover:text-indigo-900"
                  >
                    ×
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={addVariable}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
              >
                + Add Variable
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Required Signatures
            </label>
            <div className="mt-2 space-y-2">
              {formData.requiredSignatures.map((sig, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <select
                    value={sig.role}
                    onChange={(e) => {
                      const newSigs = [...formData.requiredSignatures];
                      newSigs[index].role = e.target.value as any;
                      setFormData(prev => ({
                        ...prev,
                        requiredSignatures: newSigs
                      }));
                    }}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="tenant">Tenant</option>
                    <option value="landlord">Landlord</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      requiredSignatures: prev.requiredSignatures.filter((_, i) => i !== index)
                    }))}
                    className="text-red-600 hover:text-red-900"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addSignatureRequirement}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Add Signature Requirement
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Template File
            </label>
            <div
              {...getRootProps()}
              className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
            >
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <input {...getInputProps()} />
                  <p>Drag & drop a template file, or click to select one</p>
                </div>
                <p className="text-xs text-gray-500">
                  PDF, DOC, or DOCX up to 10MB
                </p>
              </div>
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
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Save Template
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}