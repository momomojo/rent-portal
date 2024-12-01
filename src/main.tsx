import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import { performanceMonitor } from '@/core/services/performanceMonitor';
import * as Sentry from '@sentry/react';
import { cacheService } from '@/core/services/cacheService';
import './index.css';

// Initialize Sentry
if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.VITE_SENTRY_DSN,
    integrations: [new Sentry.BrowserTracing()],
    tracesSampleRate: 0.1,
  });
}

// Register service worker
if ('serviceWorker' in navigator) {
  const updateSW = registerSW({
    onNeedRefresh() {
      if (confirm('New content available. Reload?')) {
        updateSW(true);
      }
    },
    onOfflineReady() {
      console.log('App ready to work offline');
    },
  });
}

// Clean up expired cache entries periodically
setInterval(() => {
  cacheService.clearExpired();
}, 60 * 60 * 1000); // Every hour

// Monitor performance metrics
performanceMonitor.subscribe((metric) => {
  if (metric.rating === 'poor') {
    console.warn(`Poor performance detected: ${metric.name}`, metric);
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);