import apiClient from './apiClient';

export const authApi = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/auth/register', userData),
  getMe: () => apiClient.get('/auth/me'),
  updateProfile: (data) => apiClient.put('/auth/profile', data),
};

export const designsApi = {
  getDesigns: (params) => apiClient.get('/designs', { params }),
  getFeatured: () => apiClient.get('/designs/featured'),
  getBySlug: (slug) => apiClient.get(`/designs/${slug}`),
  recordShare: (id, platform) => apiClient.post(`/designs/${id}/share`, { platform }),
  create: (data) => apiClient.post('/designs', data),
  update: (id, data) => apiClient.put(`/designs/${id}`, data),
  delete: (id) => apiClient.delete(`/designs/${id}`),
};

export const categoriesApi = {
  getCategories: (params) => apiClient.get('/categories', { params }),
  getBySlug: (slug) => apiClient.get(`/categories/${slug}`),
  create: (data) => apiClient.post('/categories', data),
  update: (id, data) => apiClient.put(`/categories/${id}`, data),
  delete: (id) => apiClient.delete(`/categories/${id}`),
};

export const servicesApi = {
  getServices: (params) => apiClient.get('/services', { params }),
  getBySlug: (slug) => apiClient.get(`/services/${slug}`),
  create: (data) => apiClient.post('/services', data),
  update: (id, data) => apiClient.put(`/services/${id}`, data),
  delete: (id) => apiClient.delete(`/services/${id}`),
};

export const pricingApi = {
  getPricing: (params) => apiClient.get('/pricing', { params }),
  create: (data) => apiClient.post('/pricing', data),
  update: (id, data) => apiClient.put(`/pricing/${id}`, data),
  delete: (id) => apiClient.delete(`/pricing/${id}`),
};

export const bookingsApi = {
  create: (data) => apiClient.post('/bookings', data),
  getMyBookings: () => apiClient.get('/bookings/my'),
  getAll: (params) => apiClient.get('/bookings', { params }),
  getById: (id) => apiClient.get(`/bookings/${id}`),
  updateStatus: (id, data) => apiClient.put(`/bookings/${id}/status`, data),
  delete: (id) => apiClient.delete(`/bookings/${id}`),
};

export const testimonialsApi = {
  getApproved: () => apiClient.get('/testimonials'),
  submit: (data) => apiClient.post('/testimonials', data),
  getAll: () => apiClient.get('/testimonials/all'),
  updateStatus: (id, data) => apiClient.put(`/testimonials/${id}`, data),
  delete: (id) => apiClient.delete(`/testimonials/${id}`),
};

export const inquiriesApi = {
  submit: (data) => apiClient.post('/inquiries', data),
  getAll: (params) => apiClient.get('/inquiries', { params }),
  updateStatus: (id, data) => apiClient.put(`/inquiries/${id}/status`, data),
  delete: (id) => apiClient.delete(`/inquiries/${id}`),
};

export const favoritesApi = {
  toggle: (designId, guestId) => apiClient.post('/favorites/toggle', { designId, guestId }),
  getMyFavorites: (guestId) => apiClient.get('/favorites', { params: { guestId } }),
};

export const settingsApi = {
  getSettings: () => apiClient.get('/settings'),
  updateSettings: (data) => apiClient.put('/settings', data),
};

export const analyticsApi = {
  getDashboard: () => apiClient.get('/analytics/dashboard'),
};

export const usersApi = {
  getAll: () => apiClient.get('/users'),
  updateRole: (id, role) => apiClient.put(`/users/${id}/role`, { role }),
  delete: (id) => apiClient.delete(`/users/${id}`),
};

export const uploadApi = {
  uploadImage: (file, folder = 'designs') => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);
    return apiClient.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
