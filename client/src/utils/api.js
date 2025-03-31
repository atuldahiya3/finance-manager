// client/src/utils/api.js
import axios from 'axios';

// Set base URL for API requests
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// Add a response interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors (e.g., redirect to login)
      console.error('Unauthorized access - redirecting to login');
      // You might want to redirect to login here or handle it in your components
    }
    return Promise.reject(error);
  }
);

export default axios;