export interface Lease {
  id: string;
  propertyId: string;
  tenantId: string;
  landlordId: string;
  status: LeaseStatus;
  type: LeaseType;
  startDate: number;
  endDate: number;
  rentAmount: number;
  securityDeposit: number;
  terms: LeaseTerms;
  signatures: Signature[];
  documents: LeaseDocument[];
  createdAt: number;
  updatedAt: number;
}

export type LeaseStatus = 
  | 'draft'
  | 'pending'
  | 'active'
  | 'expired'
  | 'terminated'
  | 'renewed';

export type LeaseType = 
  | 'fixed'
  | 'month-to-month'
  | 'short-term';

export interface LeaseTerms {
  rentDueDay: number;
  lateFeeAmount: number;
  lateFeeStartDay: number;
  utilities: {
    [key: string]: {
      included: boolean;
      responsibleParty: 'tenant' | 'landlord';
    };
  };
  pets: {
    allowed: boolean;
    deposit: number;
    monthlyFee: number;
    restrictions: string[];
  };
  maintenance: {
    responsibleParty: 'tenant' | 'landlord';
    restrictions: string[];
  };
  occupancy: {
    maxOccupants: number;
    guestPolicy: string;
  };
  specialProvisions: string[];
}

export interface Signature {
  userId: string;
  role: 'tenant' | 'landlord';
  signedAt: number;
  ipAddress: string;
}

export interface LeaseDocument {
  id: string;
  type: LeaseDocumentType;
  name: string;
  url: string;
  uploadedAt: number;
  uploadedBy: string;
}

export type LeaseDocumentType = 
  | 'lease'
  | 'addendum'
  | 'inspection'
  | 'receipt'
  | 'notice'
  | 'other';