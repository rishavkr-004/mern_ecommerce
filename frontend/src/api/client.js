import axios from 'axios';

const API = axios.create({
  // PRIORITIZE the environment variable, fallback to localhost only for your local PC
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
});

API.interceptors.request.use((req) => {
  // Check both 'profile' and 'user' keys to be safe
  const savedData = localStorage.getItem('profile') || localStorage.getItem('user');
  
  if (savedData) {
    try {
      const parsedData = JSON.parse(savedData);
      // Handle nested token structure if it exists
      const token = parsedData.token || parsedData.user?.token;
      
      if (token) {
        req.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error parsing token from localStorage", error);
    }
  }
  return req;
});

export default API;