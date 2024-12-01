import { ApiClient } from '../ApiClient';
import { ApiResponse, PaginatedResponse } from '../../types/api';

export class BaseService {
  protected client: ApiClient;
  protected baseEndpoint: string;

  constructor(client: ApiClient, baseEndpoint: string) {
    this.client = client;
    this.baseEndpoint = baseEndpoint;
  }

  protected getUrl(path: string = ''): string {
    return `${this.baseEndpoint}${path}`;
  }

  protected async getOne<T>(id: string): Promise<ApiResponse<T>> {
    return this.client.get<T>(this.getUrl(`/${id}`));
  }

  protected async getList<T>(params?: Record<string, any>): Promise<ApiResponse<PaginatedResponse<T>>> {
    return this.client.get<PaginatedResponse<T>>(this.getUrl(), params);
  }

  protected async create<T>(data: Partial<T>): Promise<ApiResponse<T>> {
    return this.client.post<T>(this.getUrl(), data);
  }

  protected async update<T>(id: string, data: Partial<T>): Promise<ApiResponse<T>> {
    return this.client.put<T>(this.getUrl(`/${id}`), data);
  }

  protected async delete<T>(id: string): Promise<ApiResponse<T>> {
    return this.client.delete<T>(this.getUrl(`/${id}`));
  }
}
