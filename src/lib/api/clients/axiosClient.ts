import axios from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.WP_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Server-side token handling
axiosClient.interceptors.request.use((config) => {
  // Token is passed via config.headers from auth.ts
  if (config.headers['Authorization']) {
    config.headers['Authorization'] = config.headers['Authorization'];
  }
  return config;
});

export default axiosClient;