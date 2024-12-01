export const CORS_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:5000',
  'https://your-production-domain.com' // Replace with actual domain
];

export const CORS_METHODS = [
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'OPTIONS'
];

export const CORS_ALLOWED_HEADERS = [
  'Content-Type',
  'Authorization',
  'X-Requested-With',
  'Accept',
  'Origin'
];

export const CORS_EXPOSED_HEADERS = [
  'Content-Length',
  'X-Rate-Limit-Limit',
  'X-Rate-Limit-Remaining',
  'X-Rate-Limit-Reset'
];