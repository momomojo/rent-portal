export type MaintenanceStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';
export type MaintenancePriority = 'low' | 'medium' | 'high' | 'urgent';

export interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  status: MaintenanceStatus;
  priority: MaintenancePriority;
  createdAt: number;
  updatedAt: number;
  scheduledDate?: number;
  completedDate?: number;
  images?: string[];
  propertyId: string;
  tenantId: string;
  assignedTo?: string;
  notes?: string;
}
