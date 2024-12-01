import { BaseService } from './BaseService';
import { Payment } from '../../types/models';
import { PaymentResponse, PaymentsResponse } from '../../types/api';

export class PaymentService extends BaseService {
  constructor(client: ApiClient) {
    super(client, '/payments');
  }

  async getPayment(id: string): Promise<PaymentResponse> {
    return this.getOne<Payment>(id);
  }

  async getPayments(params?: {
    page?: number;
    pageSize?: number;
    status?: string;
    propertyId?: string;
    tenantId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<PaymentsResponse> {
    return this.getList<Payment>(params);
  }

  async createPayment(data: Partial<Payment>): Promise<PaymentResponse> {
    return this.create<Payment>(data);
  }

  async updatePayment(id: string, data: Partial<Payment>): Promise<PaymentResponse> {
    return this.update<Payment>(id, data);
  }

  async processPayment(id: string, paymentMethod: string): Promise<PaymentResponse> {
    return this.client.post<Payment>(this.getUrl(`/${id}/process`), { paymentMethod });
  }

  async refundPayment(id: string, amount?: number): Promise<PaymentResponse> {
    return this.client.post<Payment>(this.getUrl(`/${id}/refund`), { amount });
  }
}
