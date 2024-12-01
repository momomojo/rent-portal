import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { apiClient } from '@core/api/client';

// Define common response types
export interface MockResponse<T = any> {
  data: T;
  status: number;
  headers?: Record<string, string>;
}

// Create MSW server instance
export const server = setupServer();

// Helper to create API mocks
export function createApiMock<T = any>(
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  path: string,
  response: MockResponse<T>
) {
  return rest[method](`${process.env.VITE_API_URL}${path}`, (req, res, ctx) => {
    return res(
      ctx.status(response.status),
      ctx.json(response.data),
      ...(response.headers ? [ctx.set(response.headers)] : [])
    );
  });
}

// Reset API client cache between tests
export function resetApiCache() {
  apiClient.clearCache();
}

// Setup handlers for common API endpoints
export const handlers = [
  // Auth endpoints
  createApiMock('post', '/auth/login', {
    status: 200,
    data: { token: 'mock-token', user: { id: '1', email: 'test@example.com' } },
  }),
  createApiMock('post', '/auth/register', {
    status: 201,
    data: { token: 'mock-token', user: { id: '1', email: 'test@example.com' } },
  }),

  // User endpoints
  createApiMock('get', '/users/me', {
    status: 200,
    data: { id: '1', email: 'test@example.com', role: 'tenant' },
  }),

  // Error responses
  createApiMock('get', '/error/unauthorized', {
    status: 401,
    data: { message: 'Unauthorized' },
  }),
  createApiMock('get', '/error/forbidden', {
    status: 403,
    data: { message: 'Forbidden' },
  }),
  createApiMock('get', '/error/not-found', {
    status: 404,
    data: { message: 'Not Found' },
  }),
];

// Setup and teardown helpers
export function setupApiMocks() {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => {
    server.resetHandlers();
    resetApiCache();
  });
  afterAll(() => server.close());
}

// Helper to mock API errors
export function mockApiError(
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  path: string,
  status: number = 500,
  message: string = 'Internal Server Error'
) {
  server.use(
    rest[method](`${process.env.VITE_API_URL}${path}`, (req, res, ctx) => {
      return res(
        ctx.status(status),
        ctx.json({ message })
      );
    })
  );
}

// Helper to mock API success
export function mockApiSuccess<T = any>(
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  path: string,
  data: T,
  status: number = 200
) {
  server.use(
    rest[method](`${process.env.VITE_API_URL}${path}`, (req, res, ctx) => {
      return res(
        ctx.status(status),
        ctx.json(data)
      );
    })
  );
}
