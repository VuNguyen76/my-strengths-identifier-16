
// API configuration constants
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

// Log the API URL for debugging
console.log("API URL:", API_URL);

export const ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  // Service endpoints
  SERVICES: {
    ALL: '/services',
    FEATURED: '/services/featured',
    CATEGORIES: '/services/categories',
    ADMIN: {
      ALL: '/admin/services',
      CATEGORIES: '/admin/services/categories',
    }
  },
  // Specialist endpoints
  SPECIALISTS: {
    ALL: '/specialists',
    FEATURED: '/specialists/featured',
    SCHEDULE: '/specialists/schedule',
    ADMIN: '/admin/specialists',
  },
  // Booking endpoints
  BOOKINGS: {
    USER: '/bookings',
    GUEST: '/bookings/guest',
    ADMIN: '/admin/bookings',
    CANCEL: (id: string) => `/admin/bookings/${id}/cancel`,
    STATUS: (id: string) => `/admin/bookings/${id}/status`,
  },
  // Blog endpoints
  BLOGS: {
    ALL: '/blogs',
    FEATURED: '/blogs/featured',
    CATEGORIES: '/blogs/categories',
    ADMIN: {
      ALL: '/admin/blogs',
      CATEGORIES: '/admin/blogs/categories',
    }
  },
  // Dashboard endpoints
  DASHBOARD: {
    USER: '/user/dashboard',
    ADMIN: '/admin/dashboard',
  },
  // Reports endpoints
  REPORTS: {
    ALL: '/admin/reports',
    REVENUE: '/admin/reports/revenue',
    BOOKINGS: '/admin/reports/bookings',
  },
};

// HTTP request headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};
