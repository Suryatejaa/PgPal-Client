import axios from 'axios';
import { API_CONFIG } from '../config/api';

const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

if (import.meta.env.DEV) {
  console.log('🌐 API Base URL:', API_CONFIG.BASE_URL);
  console.log('🔌 WebSocket URL:', API_CONFIG.WEBSOCKET_URL);
}

axiosInstance.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    
    if (import.meta.env.DEV) {
      // console.log('📤 API Request:', config.method?.toUpperCase(), config.url);
    }
    
    return config;
  },
  (error) => {
    console.error('📤 Request Error:', error);
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];
let hasRedirected = false;

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// URLs that should NOT trigger token refresh
const NO_REFRESH_URLS = [
  '/auth-service/login',
  '/auth-service/register', 
  '/auth-service/refresh-token',
  '/auth-service/otp/verify',
  '/auth-service/forgot-password',
  '/auth-service/reset-password',
  '/auth-service/verify-email'
];

axiosInstance.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      // console.log('📥 API Response:', response.status, response.config.method?.toUpperCase(), response.config.url);
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (import.meta.env.DEV) {
      console.error('📥 API Error:', {
        status: error.response?.status,
        method: originalRequest?.method?.toUpperCase(),
        url: originalRequest?.url,
        message: error.response?.data?.message || error.message
      });
    }

    // Check if this URL should trigger token refresh
    const shouldSkipRefresh = NO_REFRESH_URLS.some(url => 
      originalRequest?.url?.includes(url)
    );

    // Handle 401 errors for protected routes
    if (error.response?.status === 401 && !originalRequest._retry && !shouldSkipRefresh) {
      console.log('🔄 401 detected for protected route, attempting refresh...');
      
      // If already refreshing, queue the request
      if (isRefreshing) {
        console.log('⏳ Already refreshing, queuing request...');
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          console.log('✅ Retrying queued request after refresh');
          return axiosInstance(originalRequest);
        }).catch(err => {
          console.error('❌ Queued request failed:', err);
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('🔄 Attempting token refresh...');
        const refreshResponse = await axiosInstance.post('/auth-service/refresh-token', {}, {
          withCredentials: true
        });
        
        console.log('✅ Token refresh successful');
        processQueue(null);
        
        console.log('🔄 Retrying original request...');
        return axiosInstance(originalRequest);
      } catch (refreshError: any) {
        console.error('❌ Token refresh failed:', refreshError.response?.data || refreshError.message);
        processQueue(refreshError);
        
        // Only clear tokens and redirect if refresh truly failed
        if (typeof window !== 'undefined' && !hasRedirected) {
          console.log('🚪 Refresh failed, need to redirect to login');
          hasRedirected = true;
          
          // Clear cookies
          document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          
          // Dispatch event to clear user state
          window.dispatchEvent(new CustomEvent('auth-expired'));
          
          // Only redirect if not on public page
          const publicPaths = ['/login', '/signUp', '/', '/about', '/contact'];
          const isPublicPage = publicPaths.some(path => 
            window.location.pathname === path || window.location.pathname.startsWith(path)
          );
          
          if (!isPublicPage) {
            // Use timeout to avoid conflicts with React rendering
            setTimeout(() => {
              window.location.href = '/login';
            }, 100);
          }
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
        console.log('🏁 Refresh process completed');
      }
    }

    // For auth endpoints, don't attempt refresh
    if (shouldSkipRefresh && error.response?.status === 401) {
      console.log('🚫 401 on auth endpoint - not attempting refresh');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;