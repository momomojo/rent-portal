import { BaseService } from './BaseService';
import { Report } from '../../types/models';
import { ReportResponse, ReportsResponse } from '../../types/api';

export class ReportService extends BaseService {
  constructor(client: ApiClient) {
    super(client, '/reports');
  }

  async getReport(id: string): Promise<ReportResponse> {
    return this.getOne<Report>(id);
  }

  async getReports(params?: {
    page?: number;
    pageSize?: number;
    type?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ReportsResponse> {
    return this.getList<Report>(params);
  }

  async generateReport(params: {
    type: string;
    startDate: string;
    endDate: string;
    format?: 'pdf' | 'csv' | 'excel';
    filters?: Record<string, any>;
  }): Promise<ReportResponse> {
    return this.client.post<Report>(this.getUrl('/generate'), params);
  }

  async getReportDownloadUrl(id: string): Promise<string> {
    const response = await this.client.get<{ url: string }>(this.getUrl(`/${id}/download`));
    return response.url;
  }

  async scheduleReport(params: {
    type: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
    format?: 'pdf' | 'csv' | 'excel';
    filters?: Record<string, any>;
  }): Promise<ReportResponse> {
    return this.client.post<Report>(this.getUrl('/schedule'), params);
  }

  async cancelScheduledReport(id: string): Promise<void> {
    return this.client.delete(this.getUrl(`/schedule/${id}`));
  }
}
