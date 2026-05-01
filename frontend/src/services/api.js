import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (error.response?.status >= 400) {
      const message = error.response?.data?.message || 'An error occurred';
      toast.error(message);
    } else if (!error.response) {
      toast.error('Network error. Please check your connection.');
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Experts API
export const expertsAPI = {
  getExperts: (params) => api.get('/experts', { params }),
  getExpert: (id) => api.get(`/experts/${id}`),
  getMyExpertProfile: () => api.get('/experts/me'),
  registerExpert: (data) => api.post('/experts/register', data),
  updateExpert: (id, data) => api.put(`/experts/${id}`, data),
  updateAvailability: (id, data) => api.put(`/experts/${id}/availability`, data),
  updateLocation: (id, data) => api.put(`/experts/${id}/location`, data),
  toggleOnline: (id, data) => api.put(`/experts/${id}/online-status`, data),
  addService: (id, data) => api.post(`/experts/${id}/services`, data),
  updateService: (id, serviceId, data) => api.put(`/experts/${id}/services/${serviceId}`, data),
  deleteService: (id, serviceId) => api.delete(`/experts/${id}/services/${serviceId}`),
  expertLogin: (credentials) => api.post('/experts/login', credentials),
};

// Bookings API
export const bookingsAPI = {
  createBooking: (data) => api.post('/bookings', data),
  getMyBookings: (params) => api.get('/bookings/my-bookings', { params }),
  getExpertBookings: (params) => api.get('/bookings/expert-bookings', { params }),
  getBooking: (id) => api.get(`/bookings/${id}`),
  updateStatus: (id, data) => api.put(`/bookings/${id}/status`, data),
  addMessage: (id, data) => api.post(`/bookings/${id}/messages`, data),
  rateBooking: (id, data) => api.post(`/bookings/${id}/rate`, data),
  cancelBooking: (id, data) => api.put(`/bookings/${id}/cancel`, data),
};

// Payments API
export const paymentsAPI = {
  createPaymentIntent: (data) => api.post('/payments/create-payment-intent', data),
  confirmPayment: (data) => api.post('/payments/confirm-payment', data),
};

// Users API
export const usersAPI = {
  getUsers: (params) => api.get('/users', { params }),
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
};

// Community API
export const communityAPI = {
  getPosts: (params) => api.get('/community/posts', { params }),
  createPost: (data) => api.post('/community/posts', data),
  getPost: (id) => api.get(`/community/posts/${id}`),
  updatePost: (id, data) => api.put(`/community/posts/${id}`, data),
  deletePost: (id) => api.delete(`/community/posts/${id}`),
  addComment: (postId, data) => api.post(`/community/posts/${postId}/comments`, data),
  getOpportunities: (params) => api.get('/community/opportunities', { params }),
  joinCommunity: (data) => api.post('/community/join', data),
  leaveCommunity: () => api.post('/community/leave'),
};

// Emergency API
export const emergencyAPI = {
  sendAlert: (data) => api.post('/emergency/alert', data),
  getEmergencyStatus: (id) => api.get(`/emergency/${id}`),
  updateEmergency: (id, data) => api.put(`/emergency/${id}`, data),
};

// AI API
export const aiAPI = {
  getRecommendations: (data) => api.post('/ai/recommendations', data),
  chat: (data) => api.post('/ai/chat', data),
};

// Video API
export const videoAPI = {
  startCall: (bookingId) => api.post(`/video/start/${bookingId}`),
  endCall: (bookingId) => api.post(`/video/end/${bookingId}`),
  getCallStatus: (bookingId) => api.get(`/video/status/${bookingId}`),
};

// Voice API
export const voiceAPI = {
  startVoice: (bookingId) => api.post(`/voice/start/${bookingId}`),
  endVoice: (bookingId) => api.post(`/voice/end/${bookingId}`),
};

// Tracking API
export const trackingAPI = {
  updateExpertLocation: (data) => api.post('/tracking/update-location', data),
  startTracking: (bookingId) => api.post(`/tracking/start-tracking/${bookingId}`),
  getTrackingHistory: (bookingId) => api.get(`/tracking/history/${bookingId}`),
  shareEmergencyLocation: (data) => api.post('/tracking/emergency-location', data),
  shareLiveLocation: (bookingId, data) => api.post(`/tracking/live-location/${bookingId}`, data),
  checkArrival: (bookingId, data) => api.post(`/tracking/check-arrival/${bookingId}`, data),
};

// Gamification API
export const gamificationAPI = {
  getUserStats: () => api.get('/gamification/stats'),
  getLeaderboards: (params) => api.get('/gamification/leaderboards', { params }),
  claimReward: (rewardId) => api.post(`/gamification/rewards/${rewardId}/claim`),
};

// Subscriptions API
export const subscriptionsAPI = {
  getPlans: () => api.get('/subscriptions/plans'),
  subscribe: (planId, data) => api.post(`/subscriptions/subscribe/${planId}`, data),
  cancelSubscription: () => api.post('/subscriptions/cancel'),
  getSubscription: () => api.get('/subscriptions/current'),
};

// Warranty API
export const warrantyAPI = {
  claimWarranty: (bookingId, data) => api.post(`/warranty/claim/${bookingId}`, data),
  getWarrantyClaims: (bookingId) => api.get(`/warranty/claims/${bookingId}`),
  updateWarrantyClaim: (claimId, data) => api.put(`/warranty/claims/${claimId}`, data),
};

export default api;
