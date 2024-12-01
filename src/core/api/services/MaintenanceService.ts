import { BaseService } from './BaseService';
import { MaintenanceRequest } from '../../types/models';
import { MaintenanceResponse, MaintenanceListResponse } from '../../types/api';

export class MaintenanceService extends BaseService {
  constructor(client: ApiClient) {
    super(client, '/maintenance');
  }

  async getMaintenanceRequest(id: string): Promise<MaintenanceResponse> {
    return this.getOne<MaintenanceRequest>(id);
  }

  async getMaintenanceRequests(params?: {
    page?: number;
    pageSize?: number;
    status?: string;
    propertyId?: string;
    priority?: string;
  }): Promise<MaintenanceListResponse> {
    return this.getList<MaintenanceRequest>(params);
  }

  async createMaintenanceRequest(data: Partial<MaintenanceRequest>): Promise<MaintenanceResponse> {
    return this.create<MaintenanceRequest>(data);
  }

  async updateMaintenanceRequest(
    id: string,
    data: Partial<MaintenanceRequest>
  ): Promise<MaintenanceResponse> {
    return this.update<MaintenanceRequest>(id, data);
  }

  async assignMaintenanceRequest(
    id: string,
    assigneeId: string
  ): Promise<MaintenanceResponse> {
    return this.client.post<MaintenanceRequest>(
      this.getUrl(`/${id}/assign`),
      { assigneeId }
    );
  }

  async updateMaintenanceStatus(
    id: string,
    status: string,
    notes?: string
  ): Promise<MaintenanceResponse> {
    return this.client.post<MaintenanceRequest>(
      this.getUrl(`/${id}/status`),
      { status, notes }
    );
  }
}
