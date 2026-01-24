import api from './api';

const authService = {
    // Login user
    login: async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, refreshToken, user } = response.data;

            // Store in localStorage
            localStorage.setItem('token', token);
            if (refreshToken) {
                localStorage.setItem('refreshToken', refreshToken);
            }
            localStorage.setItem('user', JSON.stringify(user));

            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed. Please try again.',
            };
        }
    },

    // Register new user
    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            const { token, refreshToken, user } = response.data;

            // Auto-login after registration
            localStorage.setItem('token', token);
            if (refreshToken) {
                localStorage.setItem('refreshToken', refreshToken);
            }
            localStorage.setItem('user', JSON.stringify(user));

            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Registration failed. Please try again.',
            };
        }
    },

    // Logout user
    logout: async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear localStorage regardless of API call result
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
    },

    // Get current user from localStorage
    getCurrentUser: () => {
        try {
            const userStr = localStorage.getItem('user');
            return userStr ? JSON.parse(userStr) : null;
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        const user = authService.getCurrentUser();
        return !!(token && user);
    },

    // Get user role
    getUserRole: () => {
        const user = authService.getCurrentUser();
        return user?.role || null;
    },

    // Check if user is admin
    isAdmin: () => {
        const role = authService.getUserRole();
        return role === 'ADMIN' || role === 'SUPER_ADMIN';
    },

    // Refresh token
    refreshToken: async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            const response = await api.post('/auth/refresh', { refreshToken });
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Token refresh failed.',
            };
        }
    },

    // Verify email (if needed)
    verifyEmail: async (token) => {
        try {
            const response = await api.post('/auth/verify-email', { token });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Email verification failed.',
            };
        }
    },

    // Request password reset
    forgotPassword: async (email) => {
        try {
            const response = await api.post('/auth/forgot-password', { email });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Password reset request failed.',
            };
        }
    },

    // Reset password
    resetPassword: async (token, newPassword) => {
        try {
            const response = await api.post('/auth/reset-password', { token, newPassword });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Password reset failed.',
            };
        }
    },
};

export default authService;
