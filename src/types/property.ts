export interface Property {
  id: string;
  name: string;
  description: string;
  address: string;
  type: 'apartment' | 'house' | 'condo' | 'townhouse';
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  rent: number;
  deposit: number;
  available: boolean;
  images: string[];
  amenities: string[];
  landlordId: string;
  tenantId?: string;
  createdAt: number;
  updatedAt: number;
  utilities: Utilities;
  fees: AdditionalFees;
  maintenanceHistory: MaintenanceRecord[];
  leaseTerms: LeaseTerms;
}

export interface Utilities {
  water: boolean;
  electricity: boolean;
  gas: boolean;
  internet: boolean;
  trash: boolean;
  costs: {
    [key: string]: number;
  };
}

export interface AdditionalFees {
  parking: number;
  pet: number;
  cleaning: number;
  other: {
    name: string;
    amount: number;
  }[];
}

export interface MaintenanceRecord {
  id: string;
  issue: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
  cost?: number;
  notes?: string;
}

export interface LeaseTerms {
  startDate: number;
  endDate: number;
  rentDueDay: number;
  lateFeeAmount: number;
  lateFeeStartDay: number;
  securityDeposit: number;
  petDeposit?: number;
  renewalTerms?: string;
  specialConditions?: string[];
  paymentCycle: 'monthly' | 'quarterly' | 'yearly';
}