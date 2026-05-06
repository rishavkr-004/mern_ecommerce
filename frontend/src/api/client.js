import axios from 'axios';

// PRIORITIZE the environment variable, fallback to localhost only for your local PC
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
});

// Request Interceptor
API.interceptors.request.use((req) => {
  // Check both 'profile' and 'user' keys to be safe
  const savedData = localStorage.getItem('profile') || localStorage.getItem('user');
  
  if (savedData) {
    try {
      const parsedData = JSON.parse(savedData);
      
      // Handle nested token structure if it exists
      const token = parsedData.token || parsedData.user?.token || parsedData;
      
      if (token) {
        req.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error parsing token from localStorage", error);
    }
  }
  
  // Ensure the request includes standard headers
  req.headers['Content-Type'] = 'application/json';
  return req;
});

export default API;