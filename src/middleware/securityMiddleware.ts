import { NextFunction, Request, Response } from 'express';
import { rateLimiter, securityHeaders } from '../utils/security';

export function applySecurityMiddleware(app: any) {
  // Apply rate limiting
  app.use(rateLimiter);

  // Apply security headers
  app.use((req: Request, res: Response, next: NextFunction) => {
    Object.entries(securityHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    next();
  });

  // CORS configuration
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
  });
}