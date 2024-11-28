import { useRef } from 'react';
import { Upload, Download, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';
import { Property } from '../../types/property';

interface PropertyBulkActionsProps {
  onImport: (properties: Partial<Property>[]) => Promise<void>;
  onExport: () => Promise<Property[]>;
}

export default function PropertyBulkActions({ onImport, onExport }: PropertyBulkActionsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        try {
          const properties = results.data as Partial<Property>[];
          await onImport(properties);
          toast.success('Properties imported successfully');
        } catch (error) {
          console.error('Error importing properties:', error);
          toast.error('Failed to import properties');
        }
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        toast.error('Failed to parse CSV file');
      }
    });
  };

  const handleExport = async () => {
    try {
      const properties = await onExport();
      const csv = Papa.unparse(properties);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `properties_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      toast.success('Properties exported successfully');
    } catch (error) {
      console.error('Error exporting properties:', error);
      toast.error('Failed to export properties');
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImport}
        accept=".csv"
        className="hidden"
      />
      
      <button
        onClick={() => fileInputRef.current?.click()}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <Upload className="h-5 w-5 mr-2" />
        Import Properties
      </button>

      <button
        onClick={handleExport}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <Download className="h-5 w-5 mr-2" />
        Export Properties
      </button>

      <div className="ml-4 flex items-center text-sm text-gray-500">
        <AlertCircle className="h-5 w-5 mr-2 text-gray-400" />
        <span>CSV format required for import</span>
      </div>
    </div>
  );
}