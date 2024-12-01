import { useEffect } from 'react';
import { collection, query, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

// List of critical collections to preload
const PRELOAD_COLLECTIONS = ['maintenance', 'payments', 'documents'];
const PRELOAD_LIMIT = 5; // Limit initial preload to 5 items per collection

// List of routes to preload
const PRELOAD_ROUTES = [
  () => import('../pages/Dashboard'),
  () => import('../pages/Maintenance'),
  () => import('../pages/Payments'),
  () => import('../components/MaintenanceRequestCard'),
  () => import('../components/PaymentForm')
];

export const AppPreloader: React.FC = () => {
  useEffect(() => {
    const preloadData = async () => {
      try {
        // Preload critical Firestore data
        const preloadPromises = PRELOAD_COLLECTIONS.map(async (collectionName) => {
          const q = query(collection(db(), collectionName), limit(PRELOAD_LIMIT));
          await getDocs(q);
        });

        // Preload critical route components
        const routePromises = PRELOAD_ROUTES.map(route => route());

        // Execute all preloads in parallel
        await Promise.all([...preloadPromises, ...routePromises]);
      } catch (error) {
        console.warn('Preload warning:', error);
      }
    };

    // Start preloading after initial render
    const timeoutId = setTimeout(preloadData, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  // This component doesn't render anything
  return null;
};

export default AppPreloader;
