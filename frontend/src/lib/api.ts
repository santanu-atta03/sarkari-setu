import axios from 'axios';

const isProd = process.env.NODE_ENV === 'production';
const baseURL = isProd 
  ? 'https://sarkari-setu-1.onrender.com/api' 
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api');

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('sarkari_token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors (e.g., token expiration)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('sarkari_token');
      // maybe redirect to login instead of full page reload in the future
      // window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default api;
