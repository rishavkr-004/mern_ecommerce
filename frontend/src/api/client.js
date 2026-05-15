import axios from 'axios';

// 1. Create the instance with a timeout to prevent hanging requests
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  timeout: 10000, // 10 seconds timeout is professional standard
});

// 2. Request Interceptor
API.interceptors.request.use(
  (config) => {
    // Standardize Content-Type for all POST/PUT requests
    config.headers['Content-Type'] = 'application/json';

    // Retrieve auth data safely
    const savedData = localStorage.getItem('user') || localStorage.getItem('profile');

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        
        // Extract token regardless of whether it's nested or a raw string
        const token = parsedData?.token || parsedData?.user?.token || (typeof parsedData === 'string' ? parsedData : null);

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Token Parsing Error:", error);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor (Added for Global Error Handling)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the server returns a 401 (Unauthorized), the token might be expired
    if (error.response?.status === 401) {
      console.warn("Session expired or unauthorized. Cleaning up...");
      // Optional: localStorage.removeItem('user');
      // Optional: window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;