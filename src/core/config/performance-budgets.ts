export const PERFORMANCE_BUDGETS = {
  // Time budgets (in milliseconds)
  timing: {
    // Core Web Vitals
    FCP: 1800,      // First Contentful Paint: 1.8s
    LCP: 2500,      // Largest Contentful Paint: 2.5s
    FID: 100,       // First Input Delay: 100ms
    CLS: 0.1,       // Cumulative Layout Shift: 0.1
    TTFB: 800,      // Time to First Byte: 800ms
    
    // Application-specific metrics
    propertyListLoad: 1000,     // Property listing page load: 1s
    propertyDetailLoad: 1500,   // Property detail page load: 1.5s
    searchResponse: 500,        // Search response time: 500ms
    paymentProcess: 2000,       // Payment processing: 2s
    imageLoad: 800,            // Image loading: 800ms
    filterUpdate: 200,         // Filter update response: 200ms
  },

  // Size budgets (in bytes)
  size: {
    totalBundle: 250 * 1024,    // Total JS bundle: 250KB
    initialBundle: 100 * 1024,  // Initial JS bundle: 100KB
    imageSize: 200 * 1024,      // Maximum image size: 200KB
    cssBundle: 50 * 1024,       // CSS bundle: 50KB
    fontFile: 30 * 1024,        // Font file: 30KB
  },

  // Request budgets
  requests: {
    initialPage: 15,            // Maximum initial page requests
    subsequentPage: 10,         // Maximum subsequent page requests
    imageRequests: 8,           // Maximum concurrent image requests
    apiRequests: 4,             // Maximum concurrent API requests
  }
};
