import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { server } from '../setup';
import { rest } from 'msw';
import { store } from '@core/store';
import { fetchProperties, submitApplication, processPayment } from '@core/api';

describe('API Interactions', () => {
  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  describe('Property Listings API', () => {
    test('successfully fetches properties', async () => {
      const response = await fetchProperties();
      expect(response.data).toBeDefined();
      expect(Array.isArray(response.data)).toBe(true);
    });

    test('handles pagination correctly', async () => {
      const page1 = await fetchProperties({ page: 1, limit: 10 });
      const page2 = await fetchProperties({ page: 2, limit: 10 });
      
      expect(page1.data).not.toEqual(page2.data);
      expect(page1.metadata.hasNextPage).toBe(true);
    });

    test('applies filters correctly', async () => {
      const filtered = await fetchProperties({
        filters: {
          minPrice: 1000,
          maxPrice: 2000,
          beds: 2
        }
      });
      
      expect(filtered.data.every(p => p.price >= 1000 && p.price <= 2000)).toBe(true);
      expect(filtered.data.every(p => p.beds >= 2)).toBe(true);
    });
  });

  describe('Application Submission API', () => {
    test('successfully submits application', async () => {
      const application = {
        propertyId: '123',
        applicant: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com'
        }
      };
      
      const response = await submitApplication(application);
      expect(response.status).toBe('success');
      expect(response.applicationId).toBeDefined();
    });

    test('handles validation errors', async () => {
      const invalidApplication = {
        propertyId: '123',
        applicant: {
          firstName: '', // Invalid: empty name
          lastName: 'Doe',
          email: 'invalid-email' // Invalid: bad email format
        }
      };
      
      await expect(submitApplication(invalidApplication)).rejects.toThrow();
    });
  });

  describe('Payment Processing API', () => {
    test('successfully processes payment', async () => {
      const paymentDetails = {
        amount: 1000,
        currency: 'USD',
        paymentMethodId: 'pm_123'
      };
      
      const response = await processPayment(paymentDetails);
      expect(response.status).toBe('succeeded');
      expect(response.transactionId).toBeDefined();
    });

    test('handles failed payments', async () => {
      server.use(
        rest.post('/api/payments', (req, res, ctx) => {
          return res(
            ctx.status(402),
            ctx.json({ error: 'Payment failed' })
          );
        })
      );
      
      const paymentDetails = {
        amount: 1000,
        currency: 'USD',
        paymentMethodId: 'pm_declined'
      };
      
      await expect(processPayment(paymentDetails)).rejects.toThrow('Payment failed');
    });
  });

  describe('Error Handling', () => {
    test('handles network errors', async () => {
      server.use(
        rest.get('/api/properties', (req, res) => {
          return res.networkError('Failed to connect');
        })
      );
      
      await expect(fetchProperties()).rejects.toThrow();
    });

    test('handles rate limiting', async () => {
      server.use(
        rest.get('/api/properties', (req, res, ctx) => {
          return res(
            ctx.status(429),
            ctx.json({ error: 'Too many requests' })
          );
        })
      );
      
      await expect(fetchProperties()).rejects.toThrow('Too many requests');
    });
  });
});
