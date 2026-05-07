import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5001/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('safeher_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('safeher_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login:    (data) => API.post('/auth/login', data),
  getMe:    ()     => API.get('/auth/me'),
};

export const contactsAPI = {
  getAll: ()         => API.get('/contacts'),
  add:    (data)     => API.post('/contacts', data),
  update: (id, data) => API.put(`/contacts/${id}`, data),
  delete: (id)       => API.delete(`/contacts/${id}`),
};

export const alertsAPI = {
  triggerSOS: (data) => API.post('/alerts/sos', data),
  getHistory: ()     => API.get('/alerts/history'),
  resolve:    (id)   => API.put(`/alerts/${id}/resolve`),
};

export const usersAPI = {
  updateProfile: (data)     => API.put('/users/profile', data),
  uploadImage:   (formData) => API.post('/users/profile-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateLocation: (data) => API.put('/users/location', data),
};

export const adminAPI = {
  getStats:   ()   => API.get('/admin/stats'),
  getUsers:   ()   => API.get('/admin/users'),
  getAlerts:  ()   => API.get('/admin/alerts'),
  toggleUser: (id) => API.put(`/admin/users/${id}/toggle`),
};

export default API;