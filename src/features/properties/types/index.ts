import { ReactNode } from 'react';

export interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  price: number;
  type: PropertyType;
  status: PropertyStatus;
  bedrooms: number;
  bathrooms: number;
  area: number;
  imageUrl: string;
  amenities: string[];
  createdAt: Date;
  updatedAt: Date;
  landlordId: string;
}

export type PropertyType = 'apartment' | 'house' | 'condo' | 'all';
export type PropertyStatus = 'available' | 'rented' | 'maintenance' | 'all';

export interface PropertyFilters {
  search: string;
  type: PropertyType;
  status: PropertyStatus;
  minPrice?: number;
  maxPrice?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface PropertyCardProps {
  property: Property;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export interface PropertyErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export type CreatePropertyInput = Omit<Property, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdatePropertyInput = Partial<CreatePropertyInput>;

export interface PropertyResponse {
  property: Property;
  success: boolean;
  message?: string;
}

export interface PropertyFiltersHook {
  filters: PropertyFilters;
  updateFilter: (key: keyof PropertyFilters, value: string | number) => void;
  resetFilters: () => void;
  clearFilter: (key: keyof PropertyFilters) => void;
  hasActiveFilters: boolean;
}

export interface PropertyQueryResult {
  pages: Array<PaginatedResponse<Property>>;
  pageParams: number[];
}