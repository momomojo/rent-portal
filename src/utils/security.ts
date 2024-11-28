import { z } from 'zod';
import { rateLimit } from 'express-rate-limit';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'sonner';

// Input Validation Schemas
export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
  name: z.string().min(2).max(50),
  role: z.enum(['tenant', 'landlord', 'admin']),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const paymentSchema = z.object({
  amount: z.number().positive(),
  propertyId: z.string().uuid(),
  tenantId: z.string().uuid(),
  type: z.enum(['rent', 'deposit', 'fee', 'utility', 'maintenance']),
  dueDate: z.number().int().positive(),
  paymentMethod: z.enum(['card', 'bank', 'cash', 'check']).optional(),
});

export const maintenanceSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(10).max(1000),
  priority: z.enum(['low', 'medium', 'high', 'emergency']),
  category: z.enum([
    'plumbing',
    'electrical',
    'hvac',
    'appliance',
    'structural',
    'pest',
    'cleaning',
    'other'
  ]),
  images: z.array(z.string().url()).optional(),
});

// Rate Limiting
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Audit Logging
export interface AuditLog {
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: number;
}

export async function logAudit(log: Omit<AuditLog, 'timestamp'>) {
  try {
    await addDoc(collection(db, 'auditLogs'), {
      ...log,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error logging audit:', error);
    toast.error('Failed to log audit');
  }
}

// Input Sanitization
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

// Security Headers
export const securityHeaders = {
  'Content-Security-Policy': 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://*.firebaseio.com https://*.googleapis.com; " +
    "frame-ancestors 'none';",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'X-XSS-Protection': '1; mode=block',
};