import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { preloadRoute } from '../utils/preloadComponents';

export const usePreloadComponents = () => {
  const location = useLocation();

  useEffect(() => {
    // Preload components based on current route
    preloadRoute(location.pathname);

    // Add intersection observer for navigation links
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const link = entry.target as HTMLAnchorElement;
          const href = link.getAttribute('href');
          if (href) {
            preloadRoute(href);
          }
        }
      });
    });

    // Observe all navigation links
    document.querySelectorAll('a[href^="/"]').forEach((link) => {
      observer.observe(link);
    });

    return () => {
      observer.disconnect();
    };
  }, [location.pathname]);
};
