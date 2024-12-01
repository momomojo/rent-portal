import { BaseService } from './BaseService';
import { Property } from '../../types/models';
import { PropertyResponse, PropertiesResponse } from '../../types/api';

export class PropertyService extends BaseService {
  constructor(client: ApiClient) {
    super(client, '/properties');
  }

  async getProperty(id: string): Promise<PropertyResponse> {
    return this.getOne<Property>(id);
  }

  async getProperties(params?: {
    page?: number;
    pageSize?: number;
    status?: string;
    type?: string;
  }): Promise<PropertiesResponse> {
    return this.getList<Property>(params);
  }

  async createProperty(data: Partial<Property>): Promise<PropertyResponse> {
    return this.create<Property>(data);
  }

  async updateProperty(id: string, data: Partial<Property>): Promise<PropertyResponse> {
    return this.update<Property>(id, data);
  }

  async deleteProperty(id: string): Promise<PropertyResponse> {
    return this.delete<Property>(id);
  }

  async searchProperties(query: string): Promise<PropertiesResponse> {
    return this.client.get<Property[]>(this.getUrl('/search'), { query });
  }
}
