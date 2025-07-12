import axios from 'axios';

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID || '437920819fa89d19abe380073d28839c';
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET || '28649120bdf32812f433f428b15ab1a1';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include client credentials in every request
api.interceptors.request.use((config) => {
  config.headers['client-id'] = CLIENT_ID;
  config.headers['client-secret'] = CLIENT_SECRET;
  return config;
});

export default api; 