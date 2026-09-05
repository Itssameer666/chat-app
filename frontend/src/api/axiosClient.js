import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT Bearer token to outgoing requests
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('chat_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthorized access
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token on 401 Unauthorized
      localStorage.removeItem('chat_token');
      localStorage.removeItem('chat_user');
      window.dispatchEvent(new Event('auth:logout'));
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
