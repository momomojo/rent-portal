export interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  propertyId: string;
  unitId: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  completedAt?: string;
}

export interface MaintenanceState {
  requests: MaintenanceRequest[];
  loading: boolean;
  error: string | null;
}
