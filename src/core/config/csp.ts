export const CSP_POLICY = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'",
    'https://apis.google.com',
    'https://*.firebaseio.com',
    'https://*.firebase.com',
    'https://*.googleapis.com',
    'https://*.gstatic.com',
    'https://*.stripe.com',
    'https://*.sentry.io',
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'",
    'https://fonts.googleapis.com',
  ],
  'img-src': [
    "'self'",
    'data:',
    'blob:',
    'https:',
    'https://*.stripe.com',
    'https://*.firebase.com',
    'https://*.googleapis.com',
  ],
  'font-src': [
    "'self'",
    'https://fonts.gstatic.com',
  ],
  'connect-src': [
    "'self'",
    'https://*.firebaseio.com',
    'https://*.firebase.com',
    'https://*.googleapis.com',
    'https://*.stripe.com',
    'https://*.sentry.io',
    'wss://*.firebaseio.com',
  ],
  'frame-src': [
    "'self'",
    'https://*.stripe.com',
    'https://*.firebase.com',
  ],
  'worker-src': ["'self'", 'blob:'],
  'media-src': ["'self'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': [],
};

export const generateCSP = () => {
  return Object.entries(CSP_POLICY)
    .map(([key, values]) => {
      if (values.length === 0) return key;
      return `${key} ${values.join(' ')}`;
    })
    .join('; ');
};