export interface SystemSettings {
  company: CompanyInfo;
  payment: PaymentSettings;
  email: EmailSettings;
  roles: RolePermissions;
  preferences: SystemPreferences;
}

export interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo?: string;
  taxId: string;
  businessHours: string;
  timezone: string;
}

export interface PaymentSettings {
  stripePublishableKey: string;
  stripeSecretKey: string;
  enableAutomaticPayments: boolean;
  defaultLateFeeAmount: number;
  defaultLateFeeStartDay: number;
  allowPartialPayments: boolean;
  paymentMethods: {
    card: boolean;
    bank: boolean;
    cash: boolean;
    check: boolean;
  };
}

export interface EmailSettings {
  templates: EmailTemplate[];
  defaultFromName: string;
  defaultFromEmail: string;
  emailFooter: string;
  enableEmailNotifications: boolean;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  type: EmailTemplateType;
  active: boolean;
}

export type EmailTemplateType =
  | 'welcome'
  | 'payment_reminder'
  | 'payment_received'
  | 'payment_late'
  | 'maintenance_update'
  | 'lease_expiring'
  | 'application_status';

export interface RolePermissions {
  [role: string]: {
    [permission: string]: boolean;
  };
}

export interface SystemPreferences {
  dateFormat: string;
  timeFormat: string;
  currency: string;
  language: string;
  defaultPaymentDueDay: number;
  maintenanceRequestTypes: string[];
  documentCategories: string[];
  automaticLogout: number;
  maintenancePriorityLevels: string[];
  propertyTypes: string[];
  amenityCategories: string[];
}