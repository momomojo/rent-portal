import { Property, User, Payment, MaintenanceRequest } from './models';

// Base API Response type
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
  timestamp: number;
}

// Error Response
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: number;
}

// Pagination
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Auth
export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

// Properties
export interface PropertyResponse extends ApiResponse<Property> {}
export interface PropertiesResponse extends ApiResponse<PaginatedResponse<Property>> {}

// Payments
export interface PaymentResponse extends ApiResponse<Payment> {}
export interface PaymentsResponse extends ApiResponse<PaginatedResponse<Payment>> {}

// Maintenance
export interface MaintenanceResponse extends ApiResponse<MaintenanceRequest> {}
export interface MaintenanceListResponse extends ApiResponse<PaginatedResponse<MaintenanceRequest>> {}

// Reports
export interface ReportData {
  revenue: {
    total: number;
    trends: Array<{ date: string; amount: number }>;
  };
  occupancy: {
    rate: number;
    trends: Array<{ date: string; rate: number }>;
  };
  payments: {
    collectionRate: number;
    trends: Array<{ date: string; rate: number }>;
  };
  maintenance: {
    total: number;
    trends: Array<{ date: string; count: number }>;
  };
}

export interface ReportResponse extends ApiResponse<ReportData> {}
