import axios from 'axios';
console.log("API URL:", process.env.REACT_APP_API_URL);
const API = axios.create({

  baseURL: process.env.REACT_APP_API_URL
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Auth ────────────────────────────────────────────────────────────────────
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// ─── Events ──────────────────────────────────────────────────────────────────
export const getEvents = (params) => API.get('/events', { params });
export const getEventById = (id) => API.get(`/events/${id}`);
export const createEvent = (data) => API.post('/events', data);
export const updateEvent = (id, data) => API.put(`/events/${id}`, data);
export const deleteEvent = (id) => API.delete(`/events/${id}`);

// ─── Proposals ───────────────────────────────────────────────────────────────
export const getProposals = () => API.get('/proposals');
export const getProposalById = (id) => API.get(`/proposals/${id}`);
export const createProposal = (data) => API.post('/proposals', data);
export const updateProposal = (id, data) => API.put(`/proposals/${id}`, data);
export const approveProposal = (id, data) => API.put(`/proposals/${id}/approve`, data);
export const rejectProposal = (id, data) => API.put(`/proposals/${id}/reject`, data);

// ─── Registrations ───────────────────────────────────────────────────────────
export const registerForEvent = (data) => API.post('/registrations', data);
export const getMyRegistrations = () => API.get('/registrations/my');
export const cancelRegistration = (id) => API.put(`/registrations/${id}/cancel`);
export const getAllRegistrations = () => API.get('/registrations');

// ─── Admin ───────────────────────────────────────────────────────────────────
export const getAdminStats = () => API.get('/admin/stats');
export const getAllUsers = () => API.get('/admin/users');
export const deleteUser = (id) => API.delete(`/admin/users/${id}`);
