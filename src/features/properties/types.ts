export interface PropertyFilters {
  search: string;
  type: string;
  status: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  price: number;
  type: string;
  status: 'available' | 'rented' | 'maintenance';
  bedrooms: number;
  bathrooms: number;
  area: number;
  imageUrl: string;
  amenities: string[];
  createdAt: Date;
  updatedAt: Date;
  landlordId: string;
}

export type CreatePropertyInput = Omit<Property, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdatePropertyInput = Partial<CreatePropertyInput>;