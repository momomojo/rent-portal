export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  services: string[];
  rating: number;
  hourlyRate: number;
  availability: {
    days: string[];
    hours: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
    expiryDate: number;
  };
  documents: {
    id: string;
    type: string;
    url: string;
    name: string;
    uploadedAt: number;
  }[];
  status: 'active' | 'inactive';
  createdAt: number;
  updatedAt: number;
}

export interface VendorAssignment {
  id: string;
  vendorId: string;
  maintenanceRequestId: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  scheduledDate?: number;
  completedDate?: number;
  cost?: number;
  notes?: string;
  rating?: number;
  feedback?: string;
  createdAt: number;
  updatedAt: number;
}