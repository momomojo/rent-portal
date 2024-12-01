import { format } from 'date-fns';
import { NotificationType } from '../types/notification';

interface NotificationTemplate {
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  expiresIn: number; // milliseconds
  actions?: {
    label: string;
    action: string;
    link?: string;
  }[];
}

const templates: Record<NotificationType, (data: any) => NotificationTemplate> = {
  payment_due: (data) => ({
    title: 'Payment Due',
    message: `Your rent payment of $${data.amount} is due on ${format(data.dueDate, 'MMM d, yyyy')}`,
    priority: 'high',
    expiresIn: 7 * 24 * 60 * 60 * 1000, // 7 days
    actions: [{
      label: 'Pay Now',
      action: 'view_payment',
      link: '/payments'
    }]
  }),

  payment_received: (data) => ({
    title: 'Payment Received',
    message: `Payment of $${data.amount} has been received`,
    priority: 'low',
    expiresIn: 24 * 60 * 60 * 1000, // 1 day
    actions: [{
      label: 'View Receipt',
      action: 'view_receipt',
      link: data.receiptUrl
    }]
  }),

  maintenance_update: (data) => ({
    title: 'Maintenance Update',
    message: `Your maintenance request has been ${data.status}`,
    priority: 'medium',
    expiresIn: 3 * 24 * 60 * 60 * 1000, // 3 days
    actions: [{
      label: 'View Details',
      action: 'view_maintenance',
      link: '/maintenance'
    }]
  }),

  document_shared: (data) => ({
    title: 'Document Shared',
    message: `${data.sharedBy} has shared a document with you: ${data.documentName}`,
    priority: 'medium',
    expiresIn: 5 * 24 * 60 * 60 * 1000, // 5 days
    actions: [{
      label: 'View Document',
      action: 'view_document',
      link: `/documents/${data.documentId}`
    }]
  }),

  lease_expiring: (data) => ({
    title: 'Lease Expiring Soon',
    message: `Your lease will expire on ${format(data.expiryDate, 'MMM d, yyyy')}`,
    priority: 'high',
    expiresIn: 30 * 24 * 60 * 60 * 1000, // 30 days
    actions: [{
      label: 'View Lease',
      action: 'view_lease',
      link: `/documents/${data.leaseId}`
    }]
  }),

  message_received: (data) => ({
    title: 'New Message',
    message: `${data.senderName}: ${data.preview}`,
    priority: 'medium',
    expiresIn: 7 * 24 * 60 * 60 * 1000, // 7 days
    actions: [{
      label: 'Reply',
      action: 'view_message',
      link: '/messages'
    }]
  }),

  application_status: (data) => ({
    title: 'Application Update',
    message: `Your application status has been updated to: ${data.status}`,
    priority: 'high',
    expiresIn: 7 * 24 * 60 * 60 * 1000, // 7 days
    actions: [{
      label: 'View Application',
      action: 'view_application',
      link: '/applications'
    }]
  }),

  system: (data) => ({
    title: data.title,
    message: data.message,
    priority: data.priority || 'low',
    expiresIn: data.expiresIn || 24 * 60 * 60 * 1000, // 1 day
    actions: data.actions
  })
};

export function getNotificationTemplate(
  type: NotificationType,
  data: any
): NotificationTemplate {
  return templates[type](data);
}