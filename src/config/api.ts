export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_URL || 'https://api.purple-pgs.space',
    WEBSOCKET_URL: import.meta.env.VITE_WEBSOCKET_URL || 'wss://ws.purple-pgs.space',
    
    // Service endpoints
    AUTH_SERVICE: '/auth-service',
    PROPERTY_SERVICE: '/property-service',
    TENANT_SERVICE: '/tenant-service',
    KITCHEN_SERVICE: '/kitchen-service',
    COMPLAINT_SERVICE: '/complaint-service',
    NOTIFICATION_SERVICE: '/notification-service',
    DASHBOARD_SERVICE: '/dashboard-service',
  };
  
  // Helper function to get full URL for debugging
  export const getFullApiUrl = (endpoint: string) => {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
  };