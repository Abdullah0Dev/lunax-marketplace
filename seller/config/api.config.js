const API_BASE_URL = 'https://lunax-marketplace.dmsystem.dpdns.org/api';

export default {
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
};