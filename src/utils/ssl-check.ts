// src/utils/ssl-check.ts
import { APP_CONFIG } from '../config/app';
export const verifySSL = async () => {
    try {
      const response = await fetch(APP_CONFIG.API_URL + '/health', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        console.log('✅ SSL connection verified');
        return true;
      }
    } catch (error) {
      console.error('❌ SSL verification failed:', error);
      return false;
    }
  };