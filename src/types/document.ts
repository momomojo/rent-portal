export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  category: DocumentCategory;
  url: string;
  createdAt: number;
  updatedAt: number;
  createdBy: string;
  size: number;
  version: number;
  previousVersions?: DocumentVersion[];
  sharedWith: string[];
  status: DocumentStatus;
  signatures?: Signature[];
  metadata: DocumentMetadata;
  templateId?: string;
}

export type DocumentType = 
  | 'lease'
  | 'addendum'
  | 'notice'
  | 'receipt'
  | 'application'
  | 'inspection'
  | 'maintenance'
  | 'template'
  | 'other';

export type DocumentCategory =
  | 'contracts'
  | 'financial'
  | 'maintenance'
  | 'legal'
  | 'templates'
  | 'other';

export type DocumentStatus =
  | 'draft'
  | 'pending_signature'
  | 'signed'
  | 'expired'
  | 'archived';

export interface DocumentVersion {
  id: string;
  url: string;
  createdAt: number;
  createdBy: string;
  changes: string;
  version: number;
}

export interface Signature {
  userId: string;
  name: string;
  signedAt: number;
  ipAddress: string;
  signatureUrl: string;
}

export interface DocumentMetadata {
  propertyId?: string;
  tenantId?: string;
  landlordId?: string;
  expiresAt?: number;
  keywords: string[];
  description?: string;
  isTemplate: boolean;
  requiredSignatures?: {
    role: 'tenant' | 'landlord' | 'admin';
    signed: boolean;
    signedBy?: string;
  }[];
}