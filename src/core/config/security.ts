export const CSP_POLICY = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // For inline scripts (consider removing if possible)
    'https://apis.google.com', // For Firebase
    'https://www.gstatic.com',
    'https://www.googletagmanager.com',
    'https://js.stripe.com', // For Stripe
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for MUI and Tailwind
    'https://fonts.googleapis.com',
  ],
  'img-src': [
    "'self'",
    'data:',
    'https:',
    'blob:',
  ],
  'font-src': [
    "'self'",
    'https://fonts.gstatic.com',
  ],
  'connect-src': [
    "'self'",
    'https://firestore.googleapis.com',
    'https://identitytoolkit.googleapis.com',
    'https://securetoken.googleapis.com',
    'https://api.stripe.com',
    'wss://firestore.googleapis.com',
  ],
  'frame-src': [
    "'self'",
    'https://js.stripe.com',
    'https://hooks.stripe.com',
  ],
  'worker-src': ["'self'", 'blob:'],
  'media-src': ["'self'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': [],
};

// Convert policy to string
export const getCspString = () => {
  return Object.entries(CSP_POLICY)
    .map(([key, values]) => {
      if (values.length === 0) return key;
      return `${key} ${values.join(' ')}`;
    })
    .join('; ');
};