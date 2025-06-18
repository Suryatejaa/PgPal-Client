// src/config/app.ts
export const APP_CONFIG = {
    API_URL: import.meta.env.VITE_API_URL || 'https://api.purple-pgs.space',
    WEBSOCKET_URL: import.meta.env.VITE_WEBSOCKET_URL || 'wss://ws.purple-pgs.space',
    APP_TYPE: import.meta.env.VITE_APP_TYPE,
    APP_DOMAIN: import.meta.env.VITE_APP_DOMAIN,
    IS_DEVELOPMENT: import.meta.env.DEV,
    IS_PRODUCTION: import.meta.env.PROD,
  };
  
  // CORS domains for production
  export const ALLOWED_DOMAINS = [
    'https://purple-pgs.space',
    'https://www.purple-pgs.space',
    'https://api.purple-pgs.space',
    'https://owner.purple-pgs.space',
    'https://tenant.purple-pgs.space',
    'https://admin.purple-pgs.space',
  ];