import axios from 'axios';

const BASE_URL = "https://vanivoicechat.com/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (injected by Flutter WebView)
    let token = localStorage.getItem('token');
    
    // Fallback token for testing/development when running on localhost
    if (!token && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      token = "V52rzcafZU3I12EKhMMqIls36rhAUuDZEeGKB9t8a14e11fd";
    }

    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Global error handling
    if (error.response) {
      console.error('API Error Response:', error.response.data);
    } else if (error.request) {
      console.error('API Error Request:', error.request);
    } else {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
