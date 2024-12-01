import { matchPath } from 'react-router-dom';

interface PrefetchRule {
  path: string;
  components: string[];
  condition?: () => boolean;
}

const prefetchRules: PrefetchRule[] = [
  {
    path: '/dashboard',
    components: [
      '@features/properties/components/Properties',
      '@features/maintenance/components/MaintenanceRequests'
    ]
  },
  {
    path: '/properties',
    components: [
      '@features/maintenance/components/MaintenanceRequests',
      '@features/messages/pages/Messages'
    ]
  },
  {
    path: '/messages',
    components: ['@features/profile/pages/Profile'],
    condition: () => !!localStorage.getItem('user')
  }
];

const prefetchCache = new Set<string>();

export const prefetchComponent = async (path: string): Promise<void> => {
  if (prefetchCache.has(path)) return;

  try {
    prefetchCache.add(path);
    await import(/* @vite-ignore */ path);
  } catch (error) {
    prefetchCache.delete(path);
    console.error(`Failed to prefetch ${path}:`, error);
  }
};

export const getPrefetchComponentsForRoute = (pathname: string): string[] => {
  const matchingRule = prefetchRules.find(
    rule => matchPath(rule.path, pathname) && (!rule.condition || rule.condition())
  );
  return matchingRule?.components || [];
};

export const prefetchInViewport = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const link = entry.target as HTMLAnchorElement;
          const path = link.getAttribute('data-prefetch');
          if (path) {
            prefetchComponent(path);
          }
        }
      });
    },
    { rootMargin: '50px' }
  );

  document.querySelectorAll('a[data-prefetch]').forEach(
    link => observer.observe(link)
  );

  return () => observer.disconnect();
};
