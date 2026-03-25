import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  timeout: 300000, // Increased to 300s (5m) for large batch uploads and Render cold starts
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
// Response interceptor to handle global errors (like 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const message = error.response.data?.message || "";
      const isExpired = message.toLowerCase().includes("expired") || message.toLowerCase().includes("jwt");
      
      if (isExpired) {
        // Clear all auth data locally to prevent further authorized requests
        const authKeys = [
          'admin_access_token', 'admin_refresh_token', 'admin_user',
          'volunteer_access_token', 'volunteer_refresh_token', 'volunteer_user',
          'donor_access_token', 'donor_refresh_token', 'donor_user',
          'accessToken', 'refreshToken', 'user'
        ];
        authKeys.forEach(key => localStorage.removeItem(key));

        // Notify user and redirect
        alert("Your session has expired. Please log in again to continue.");
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
