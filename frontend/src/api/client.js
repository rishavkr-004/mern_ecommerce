import axios from 'axios';

const API = axios.create({
  // baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  baseURL: 'http://localhost:5000', // HARD-CODED FOR LOCAL TESTING
});

API.interceptors.request.use((req) => {
  const profile = localStorage.getItem('profile');
  if (profile) {
    req.headers.Authorization = `Bearer ${JSON.parse(profile).token}`;
  }
  return req;
});

export default API;