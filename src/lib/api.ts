import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ani_digital_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('ani_digital_token');
      localStorage.removeItem('ani_digital_user');
      window.location.href = '/app/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (userData: any) => api.post('/auth/signup', userData),
  login: (credentials: { email: string; password: string }) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

// Users API
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data),
};

// Products API
export const productsAPI = {
  getAll: (params?: any) => api.get('/products', { params }),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (formData: FormData) => api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id: string, data: any) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
};

// Diagnoses API
export const diagnosesAPI = {
  getAll: () => api.get('/diagnoses'),
  getById: (id: string) => api.get(`/diagnoses/${id}`),
  create: (formData: FormData) => api.post('/diagnoses', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id: string, data: any) => api.put(`/diagnoses/${id}`, data),
};

// Transactions API
export const transactionsAPI = {
  getAll: (params?: any) => api.get('/transactions', { params }),
  getById: (id: string) => api.get(`/transactions/${id}`),
  create: (data: any) => api.post('/transactions', data),
  update: (id: string, data: any) => api.put(`/transactions/${id}`, data),
};

// Market Prices API
export const marketPricesAPI = {
  getAll: (params?: any) => api.get('/market-prices', { params }),
  getLatest: (params?: any) => api.get('/market-prices/latest', { params }),
  getTrends: (commodity: string, params?: any) => 
    api.get(`/market-prices/trends/${commodity}`, { params }),
};

// Weather API
export const weatherAPI = {
  getCurrent: (params: { municipality: string; province: string }) => 
    api.get('/weather', { params }),
  getForecast: (params: { municipality: string; province: string; days?: number }) => 
    api.get('/weather/forecast', { params }),
  getAdvisories: (params?: any) => api.get('/weather/advisories', { params }),
};

// Financials API
export const financialsAPI = {
  getAll: (params?: any) => api.get('/financials', { params }),
  getSummary: (params?: any) => api.get('/financials/summary', { params }),
  getById: (id: string) => api.get(`/financials/${id}`),
  create: (formData: FormData) => api.post('/financials', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id: string, data: any) => api.put(`/financials/${id}`, data),
  delete: (id: string) => api.delete(`/financials/${id}`),
};

export default api;
