import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '../utils/constants';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // Server responded with error
            switch (error.response.status) {
                case 401:
                    // Unauthorized - Clear token and redirect to login
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                    break;
                case 403:
                    // Forbidden
                    console.error('Access forbidden:', error.response.data);
                    break;
                case 404:
                    // Not found
                    console.error('Resource not found:', error.response.data);
                    break;
                case 500:
                    // Server error
                    console.error('Server error:', error.response.data);
                    break;
                default:
                    console.error('API Error:', error.response.data);
            }
        } else if (error.request) {
            // Request made but no response
            console.error('Network error:', error.request);
        } else {
            // Error in request setup
            console.error('Request error:', error.message);
        }
        return Promise.reject(error);
    }
);

// API methods
export const apiClient = {
    // GET request
    get: async (url, config = {}) => {
        try {
            const response = await api.get(url, config);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Request failed',
            };
        }
    },

    // POST request
    post: async (url, data = {}, config = {}) => {
        try {
            const response = await api.post(url, data, config);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Request failed',
            };
        }
    },

    // PUT request
    put: async (url, data = {}, config = {}) => {
        try {
            const response = await api.put(url, data, config);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Request failed',
            };
        }
    },

    // PATCH request
    patch: async (url, data = {}, config = {}) => {
        try {
            const response = await api.patch(url, data, config);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Request failed',
            };
        }
    },

    // DELETE request
    delete: async (url, config = {}) => {
        try {
            const response = await api.delete(url, config);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Request failed',
            };
        }
    },
};

export default api;
