import apiClient from './client';

// Auth API
export const authAPI = {
  register: (data) => apiClient.post('/api/auth/register', data),
  login: (data) => apiClient.post('/api/auth/login', data),
  getMe: () => apiClient.get('/api/auth/me'),
};

// Workflows API
export const workflowsAPI = {
  create: (data) => apiClient.post('/api/workflows', data),
  list: () => apiClient.get('/api/workflows'),
  get: (id) => apiClient.get(`/api/workflows/${id}`),
  update: (id, data) => apiClient.put(`/api/workflows/${id}`, data),
  delete: (id) => apiClient.delete(`/api/workflows/${id}`),
  execute: (id, data) => apiClient.post(`/api/workflows/${id}/execute`, data),
  getChatHistory: (id) => apiClient.get(`/api/workflows/${id}/chat-history`),
};

// Documents API
export const documentsAPI = {
  upload: (formData) => apiClient.post('/api/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  }),
  list: () => apiClient.get('/api/documents'),
  get: (id) => apiClient.get(`/api/documents/${id}`),
  delete: (id) => apiClient.delete(`/api/documents/${id}`),
};
