// Utility to preload components based on user role and current route
export const preloadComponents = {
  dashboard: () => {
    // Preload components commonly accessed from dashboard
    import('@features/properties/components/Properties');
    import('@features/maintenance/components/MaintenanceRequests');
    import('@features/messages/pages/Messages');
  },
  
  properties: () => {
    // Preload components commonly accessed from properties
    import('@features/maintenance/components/MaintenanceRequests');
    import('@features/messages/pages/Messages');
  },
  
  admin: () => {
    // Preload admin-specific components
    import('@features/admin/components/UserManagement');
    import('@features/admin/components/Analytics');
  },
  
  profile: () => {
    // Preload profile-related components
    import('@features/settings/pages/Settings');
    import('@features/messages/pages/Messages');
  }
};

export const preloadRoute = (route: string) => {
  switch (route) {
    case '/dashboard':
      preloadComponents.dashboard();
      break;
    case '/properties':
      preloadComponents.properties();
      break;
    case '/admin':
      preloadComponents.admin();
      break;
    case '/profile':
      preloadComponents.profile();
      break;
    default:
      break;
  }
};
