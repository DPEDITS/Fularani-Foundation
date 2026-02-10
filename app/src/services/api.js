import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  timeout: 60000, // Increased to 60s for Render cold starts
});

// Request interceptor to handle FormData properly
api.interceptors.request.use(
  (config) => {
    // If the data is FormData, let the browser set the Content-Type (with boundary)
    if (config.data instanceof FormData) {
      // Remove any Content-Type header so browser can set it with boundary
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
