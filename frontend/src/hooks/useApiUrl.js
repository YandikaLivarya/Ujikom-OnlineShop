/**
 * Custom hook untuk mendapatkan API URL dari environment variable
 * Gunakan ini di semua component yang perlu fetch ke backend
 */

export const useApiUrl = () => {
  return import.meta.env.VITE_API_URL || 'http://localhost:5000';
};
