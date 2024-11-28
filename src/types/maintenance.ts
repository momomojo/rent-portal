export interface MaintenanceRequest {
  id: string;
  propertyId: string;
  tenantId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'emergency';
  status: 'pending' | 'approved' | 'in-progress' | 'completed' | 'declined';
  category: MaintenanceCategory;
  images?: string[];
  createdAt: number;
  updatedAt: number;
  scheduledDate?: number;
  completedDate?: number;
  assignedTo?: string;
  cost?: number;
  notes?: string[];
}

export type MaintenanceCategory =
  | 'plumbing'
  | 'electrical'
  | 'hvac'
  | 'appliance'
  | 'structural'
  | 'pest'
  | 'cleaning'
  | 'other';