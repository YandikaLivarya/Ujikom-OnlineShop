import axios from 'axios';

/**
 * ✅ Axios instance dengan CORS + Ngrok headers
 * Auto-include ngrok-skip-browser-warning di semua requests
 */
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true', // ✅ Skip ngrok browser warning
    'x-ngrok-skip-browser-warning': 'true', // ✅ Alternative header
  },
});

/**
 * ✅ Custom interceptor untuk debug + auto-add headers
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // Ensure ngrok headers always included
    if (!config.headers['ngrok-skip-browser-warning']) {
      config.headers['ngrok-skip-browser-warning'] = 'true';
    }
    
    // Add token jika ada
    const token = localStorage.getItem('token');
    if (token && !config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * ✅ Error interceptor untuk handle CORS errors
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 0 || error.message?.includes('CORS')) {
      console.error('❌ CORS Error detected. Check backend CORS configuration.');
    }
    return Promise.reject(error);
  }
);

/**
 * ✅ Hook untuk get API URL (berguna untuk Fetch API)
 */
export const useApiUrl = () => {
  return import.meta.env.VITE_API_URL || 'http://localhost:5000';
};

/**
 * ✅ Hook untuk get headers dengan ngrok + auth support
 */
export const useApiHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
    'x-ngrok-skip-browser-warning': 'true',
    ...(localStorage.getItem('token') && {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    }),
  };
};

export default axiosInstance;
