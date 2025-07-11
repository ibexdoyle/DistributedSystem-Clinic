import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8082';
const PATIENT_SERVICE_URL = 'http://localhost:8083'; 

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // This is important for sending cookies
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  responseType: 'json',
});

// Tạo instance riêng cho patient service
const patientApi = axios.create({
  baseURL: PATIENT_SERVICE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  responseType: 'json',
});

// Add a request interceptor to include the auth token and user email
api.interceptors.request.use(
  (config) => {
    // Get token from cookies
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];
    
    if (token) {
      // Add Authorization header
      config.headers.Authorization = `Bearer ${token}`;
      
      try {
        // Decode the token to get user email
        const decoded = jwtDecode(token);
        if (decoded && decoded.sub) {
          config.headers['x-user-Id'] = decoded.sub; // sub is the email in JWT
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle responses and errors
api.interceptors.response.use(
  (response) => {
    // If the response is a string that looks like JSON, parse it
    if (typeof response.data === 'string' && 
        (response.data.trim().startsWith('{') || response.data.trim().startsWith('['))) {
      try {
        response.data = JSON.parse(response.data);
      } catch (e) {
        console.warn('Failed to parse response as JSON:', response.data);
      }
    }
    return response;
  },
  (error) => {
    if (!error.response) {
      // Network error or server not responding
      error.response = {
        status: 0,
        data: {
          message: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.'
        }
      };
    } else if (error.response.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    } else if (error.response.data) {
      // Ensure error response data is properly formatted
      if (typeof error.response.data === 'string') {
        try {
          error.response.data = JSON.parse(error.response.data);
        } catch (e) {
          // If it's not JSON, wrap it in a message property
          error.response.data = { message: error.response.data };
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Add a request interceptor to include the auth token and user email
api.interceptors.request.use(
  (config) => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];
    
    if (token) {
      // Add Authorization header
      config.headers.Authorization = `Bearer ${token}`;
      
      try {
        // Decode the token to get user email
        const decoded = jwtDecode(token);
        if (decoded && decoded.sub) {
          config.headers['x-user-Id'] = decoded.sub; // sub is the email in JWT
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
    
    // Add CORS headers
    config.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000';
    config.headers['Access-Control-Allow-Credentials'] = 'true';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle responses and errors
api.interceptors.response.use(
  (response) => {
    // If the response is a string that looks like JSON, parse it
    if (typeof response.data === 'string' && 
        (response.data.trim().startsWith('{') || response.data.trim().startsWith('['))) {
      try {
        response.data = JSON.parse(response.data);
      } catch (e) {
        console.warn('Failed to parse response as JSON:', response.data);
      }
    }
    return response;
  },
  (error) => {
    if (!error.response) {
      // Network error or server not responding
      error.response = {
        status: 0,
        data: {
          message: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.'
        }
      };
    } else if (error.response.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    } else if (error.response.data) {
      // Ensure error response data is properly formatted
      if (typeof error.response.data === 'string') {
        try {
          error.response.data = JSON.parse(error.response.data);
        } catch (e) {
          // If it's not JSON, wrap it in a message property
          error.response.data = { message: error.response.data };
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  LOGOUT: '/api/auth/logout',
  
  // Staff
  STAFF: {
    BASE: '/api/staffs',
    GET_DOCTORS: '/api/staffs/doctors',
    GET_SPECIALIZATIONS: '/api/staffs/specializations'
  },
  
  // Appointments
  APPOINTMENTS: {
    BASE: '/api/appointments',
    TIME_SLOTS: '/api/appointments/available-slots',
    PATIENT_APPOINTMENTS: (patientId) => `/api/appointments/patient/${patientId}`
  },
  
  // Add other endpoints as needed
};

export { api as default, patientApi };