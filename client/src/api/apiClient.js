import axios from 'axios';

// Prioritize VITE_API_URL, fallback to /api which is proxied via vercel.json in production or vite.config.js in dev
const rawBase = import.meta.env.VITE_API_URL || import.meta.env.API_URL || '/api';
const baseURL = rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase;

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor to add JWT token if stored
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mehndi_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for clear error messaging
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
