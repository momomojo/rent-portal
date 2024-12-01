import { z } from 'zod';

// Validation schemas for rental data
export const rentalDataSchemas = {
  // Property listing validation
  propertyListing: z.object({
    title: z.string().min(5).max(100),
    description: z.string().min(20).max(2000),
    price: z.number().positive().max(1000000),
    location: z.object({
      address: z.string(),
      city: z.string(),
      state: z.string(),
      zipCode: z.string().regex(/^\d{5}(-\d{4})?$/),
      coordinates: z.object({
        latitude: z.number(),
        longitude: z.number(),
      }).optional(),
    }),
    features: z.array(z.string()),
    images: z.array(z.string().url()).max(10),
  }),

  // Personal information validation
  personalInfo: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    phone: z.string().regex(/^\+?[\d\s-]{10,}$/),
    ssn: z.string().regex(/^\d{3}-\d{2}-\d{4}$/).optional(),
    dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  }),

  // Payment information validation
  paymentInfo: z.object({
    cardNumber: z.string().regex(/^\d{4}-\d{4}-\d{4}-\d{4}$/),
    expiryDate: z.string().regex(/^\d{2}\/\d{2}$/),
    cvv: z.string().regex(/^\d{3,4}$/),
  }),
};

// Data masking patterns
export const dataMaskingPatterns = {
  ssn: (value: string) => value.replace(/^(\d{3})-(\d{2})-(\d{4})$/, 'xxx-xx-$3'),
  cardNumber: (value: string) => value.replace(/^(\d{4})-(\d{4})-(\d{4})-(\d{4})$/, '****-****-****-$4'),
  phone: (value: string) => value.replace(/^(\+?\d{1,3})?[\s-]?\(?(\d{3})\)?[\s-]?(\d{3})[\s-]?(\d{4})$/, '($2) ***-$4'),
  email: (value: string) => {
    const [local, domain] = value.split('@');
    return `${local.charAt(0)}${'*'.repeat(local.length - 2)}${local.charAt(local.length - 1)}@${domain}`;
  },
};

// Security rules for different user roles
export const securityRules = {
  tenant: {
    canView: ['propertyListings', 'ownApplications', 'ownPayments'],
    canEdit: ['ownProfile', 'ownApplications'],
    canCreate: ['applications', 'payments', 'maintenanceRequests'],
  },
  landlord: {
    canView: ['ownProperties', 'applicationsForProperties', 'paymentsReceived'],
    canEdit: ['ownProperties', 'propertySettings'],
    canCreate: ['properties', 'announcements', 'maintenanceResponses'],
  },
  admin: {
    canView: ['allProperties', 'allUsers', 'allTransactions', 'systemLogs'],
    canEdit: ['allProperties', 'userRoles', 'systemSettings'],
    canCreate: ['users', 'properties', 'announcements'],
  },
};

// Rate limiting configurations for different endpoints
export const rateLimits = {
  search: {
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30, // 30 requests per minute
  },
  applications: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 applications per hour
  },
  payments: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // 3 payment attempts per 15 minutes
  },
  login: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 login attempts per 15 minutes
  },
};

// Sensitive data handling
export const sensitiveDataConfig = {
  // Fields that should never be logged
  noLogging: ['password', 'ssn', 'cardNumber', 'cvv'],
  
  // Fields that should be encrypted at rest
  encrypt: ['ssn', 'bankAccount', 'cardNumber'],
  
  // Fields that should be masked in responses
  mask: ['ssn', 'cardNumber', 'phone', 'email'],
};

// Document upload security
export const uploadSecurity = {
  allowedFileTypes: [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/heic',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  maxFileSize: 5 * 1024 * 1024, // 5MB
  maxFiles: 10,
  scanVirus: true,
  sanitizeFilename: true,
};
