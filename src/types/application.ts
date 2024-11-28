export interface TenantApplication {
  id: string;
  applicantId: string;
  propertyId: string;
  status: ApplicationStatus;
  personalInfo: PersonalInfo;
  employmentInfo: EmploymentInfo;
  rentalHistory: RentalHistory[];
  references: Reference[];
  documents: Document[];
  creditCheck?: CreditCheck;
  backgroundCheck?: BackgroundCheck;
  createdAt: number;
  updatedAt: number;
  reviewedBy?: string;
  reviewNotes?: string;
}

export type ApplicationStatus = 
  | 'pending'
  | 'screening'
  | 'approved'
  | 'rejected'
  | 'waitlist';

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  ssn: string;
  currentAddress: Address;
  moveInDate?: string;
  desiredLeaseTerm?: number;
  occupants: number;
  pets?: Pet[];
  vehicleInfo?: Vehicle[];
  emergencyContact: EmergencyContact;
}

export interface Address {
  street: string;
  unit?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Pet {
  type: string;
  breed: string;
  weight: number;
  age: number;
  name: string;
}

export interface Vehicle {
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  state: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email: string;
  address: Address;
}

export interface EmploymentInfo {
  currentEmployer: string;
  position: string;
  employmentLength: number;
  monthlyIncome: number;
  supervisorName: string;
  supervisorPhone: string;
  supervisorEmail: string;
  employerAddress: Address;
  additionalIncome?: {
    source: string;
    amount: number;
    frequency: 'monthly' | 'annual';
  }[];
}

export interface RentalHistory {
  address: Address;
  landlordName: string;
  landlordPhone: string;
  landlordEmail: string;
  monthlyRent: number;
  moveInDate: string;
  moveOutDate?: string;
  reasonForLeaving?: string;
}

export interface Reference {
  name: string;
  relationship: string;
  phone: string;
  email: string;
  yearsKnown: number;
}

export interface Document {
  id: string;
  type: DocumentType;
  name: string;
  url: string;
  uploadedAt: number;
  verified: boolean;
}

export type DocumentType = 
  | 'id'
  | 'proofOfIncome'
  | 'bankStatement'
  | 'reference'
  | 'rentalHistory'
  | 'other';

export interface CreditCheck {
  score: number;
  report: string;
  date: number;
  provider: string;
}

export interface BackgroundCheck {
  criminalRecord: boolean;
  evictionHistory: boolean;
  report: string;
  date: number;
  provider: string;
}