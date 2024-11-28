import { http, HttpResponse } from 'msw';

export const handlers = [
  // Auth handlers
  http.post('*/auth/signin', async () => {
    return HttpResponse.json({
      user: {
        uid: 'test-user-id',
        email: 'test@example.com',
        displayName: 'Test User',
      },
      token: 'mock-token',
    });
  }),

  // Stripe handlers
  http.post('*/create-payment-intent', async () => {
    return HttpResponse.json({
      clientSecret: 'test_client_secret',
    });
  }),

  // Properties handlers
  http.get('*/properties', () => {
    return HttpResponse.json([
      {
        id: '1',
        name: 'Test Property',
        address: '123 Test St',
        rent: 1200,
        available: true,
      },
    ]);
  }),

  // Payments handlers
  http.post('*/payments', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      id: 'payment-id',
      ...body,
      status: 'pending',
    });
  }),

  // Maintenance handlers
  http.get('*/maintenance-requests', () => {
    return HttpResponse.json([
      {
        id: '1',
        title: 'Test Request',
        status: 'pending',
        priority: 'medium',
      },
    ]);
  }),

  // Documents handlers
  http.post('*/documents', async ({ request }) => {
    const formData = await request.formData();
    return HttpResponse.json({
      id: 'doc-id',
      name: formData.get('name'),
      url: 'https://example.com/test.pdf',
    });
  }),

  // Users handlers
  http.get('*/users', () => {
    return HttpResponse.json([
      {
        uid: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'tenant',
      },
    ]);
  }),
];