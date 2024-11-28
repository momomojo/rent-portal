export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: number;
  link?: string;
  data?: Record<string, any>;
  priority: 'low' | 'medium' | 'high';
  expiresAt?: number;
  actions?: NotificationAction[];
}

export type NotificationType =
  | 'payment_due'
  | 'payment_received'
  | 'payment_late'
  | 'maintenance_update'
  | 'document_shared'
  | 'lease_expiring'
  | 'message_received'
  | 'application_status'
  | 'system';

export interface NotificationAction {
  label: string;
  action: string;
  link?: string;
  data?: Record<string, any>;
}

export interface NotificationTemplate {
  title: string;
  message: string;
  priority: Notification['priority'];
  expiresIn: number;
  actions?: NotificationAction[];
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  categories: {
    [K in NotificationType]: {
      enabled: boolean;
      priority: Notification['priority'];
    };
  };
}