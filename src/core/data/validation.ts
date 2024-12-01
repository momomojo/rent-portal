import { z } from 'zod';

// Base schemas for common fields
const addressSchema = z.object({
  street: z.string().min(5).max(100),
  city: z.string().min(2).max(50),
  state: z.string().length(2),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/),
  country: z.string().default('USA'),
});

const priceSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default('USD'),
  period: z.enum(['monthly', 'yearly']),
});

const contactSchema = z.object({
  email: z.string().email(),
  phone: z.string().regex(/^\+?[\d\s-]{10,}$/),
  preferredContact: z.enum(['email', 'phone']).default('email'),
});

// Property schemas
export const propertySchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(10).max(100),
  description: z.string().min(50).max(2000),
  type: z.enum(['apartment', 'house', 'condo', 'townhouse']),
  status: z.enum(['available', 'rented', 'pending']),
  price: priceSchema,
  address: addressSchema,
  features: z.array(z.string()),
  amenities: z.array(z.string()),
  bedrooms: z.number().int().positive(),
  bathrooms: z.number().positive(),
  squareFeet: z.number().positive(),
  images: z.array(z.string().url()).min(1).max(20),
  availableFrom: z.string().datetime(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

// Application schemas
export const applicationSchema = z.object({
  id: z.string().uuid().optional(),
  propertyId: z.string().uuid(),
  userId: z.string().uuid(),
  status: z.enum(['draft', 'submitted', 'reviewing', 'approved', 'rejected']),
  personalInfo: z.object({
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    dateOfBirth: z.string().datetime(),
    ssn: z.string().regex(/^\d{3}-\d{2}-\d{4}$/),
    contact: contactSchema,
  }),
  employment: z.object({
    employer: z.string().min(2).max(100),
    position: z.string().min(2).max(100),
    income: z.number().positive(),
    startDate: z.string().datetime(),
    employerContact: contactSchema,
  }),
  documents: z.array(
    z.object({
      type: z.enum(['id', 'payslip', 'bankStatement', 'reference']),
      url: z.string().url(),
      name: z.string(),
      uploadedAt: z.string().datetime(),
    })
  ),
  references: z.array(
    z.object({
      name: z.string().min(2).max(100),
      relationship: z.string().min(2).max(50),
      contact: contactSchema,
    })
  ).min(2).max(5),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

// Search schemas
export const searchFiltersSchema = z.object({
  priceRange: z.object({
    min: z.number().nonnegative(),
    max: z.number().positive(),
  }),
  propertyTypes: z.array(z.enum(['apartment', 'house', 'condo', 'townhouse'])),
  bedrooms: z.number().int().nonnegative(),
  bathrooms: z.number().nonnegative(),
  amenities: z.array(z.string()),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    radius: z.number().positive(), // in miles
  }).optional(),
  availableFrom: z.string().datetime().optional(),
  sortBy: z.enum(['price', 'date', 'relevance']).default('relevance'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Type inference
export type Property = z.infer<typeof propertySchema>;
export type Application = z.infer<typeof applicationSchema>;
export type SearchFilters = z.infer<typeof searchFiltersSchema>;

// Validation functions
export const validateProperty = (data: unknown): Property => {
  return propertySchema.parse(data);
};

export const validateApplication = (data: unknown): Application => {
  return applicationSchema.parse(data);
};

export const validateSearchFilters = (data: unknown): SearchFilters => {
  return searchFiltersSchema.parse(data);
};
