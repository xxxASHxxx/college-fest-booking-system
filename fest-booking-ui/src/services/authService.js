import { apiClient } from './api';
import { setAuthToken, clearAuthToken } from '../utils/helpers';

const authService = {
    // Register new user
    register: async (userData) => {
        try {
            const result = await apiClient.post('/api/auth/register', userData);

            if (result.success && result.data?.data) {
                // Backend returns: { success: true, data: { token, userId, email, fullName, role } }
                const authData = result.data.data;
                setAuthToken(authData.token);

                // Create user object from auth response
                const user = {
                    id: authData.userId,
                    email: authData.email,
                    fullName: authData.fullName,
                    name: authData.fullName, // alias for compatibility
                    role: authData.role,
                };

                localStorage.setItem('user', JSON.stringify(user));
                return { success: true, data: { ...authData, user } };
            }

            return result;
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Registration failed',
            };
        }
    },

    // Login user
    login: async (credentials) => {
        try {
            const result = await apiClient.post('/api/auth/login', credentials);

            if (result.success && result.data?.data) {
                // Backend returns: { success: true, data: { token, userId, email, fullName, role } }
                const authData = result.data.data;
                setAuthToken(authData.token);

                // Create user object from auth response
                const user = {
                    id: authData.userId,
                    email: authData.email,
                    fullName: authData.fullName,
                    name: authData.fullName, // alias for compatibility
                    role: authData.role,
                };

                localStorage.setItem('user', JSON.stringify(user));
                return { success: true, data: { ...authData, user } };
            }

            return result;
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Login failed',
            };
        }
    },

    // Logout user
    logout: async () => {
        try {
            await apiClient.post('/api/auth/logout');
            clearAuthToken();
            localStorage.removeItem('user');
            return { success: true };
        } catch (error) {
            // Clear local data even if API call fails
            clearAuthToken();
            localStorage.removeItem('user');
            return { success: true };
        }
    },

    // Get current user
    getCurrentUser: async () => {
        try {
            const result = await apiClient.get('/api/auth/me');

            if (result.success && result.data?.data) {
                // Backend returns nested structure
                const userData = result.data.data;

                // Create normalized user object
                const user = {
                    id: userData.id,
                    email: userData.email,
                    fullName: userData.fullName,
                    name: userData.fullName,
                    phoneNumber: userData.phoneNumber,
                    role: userData.role,
                    isVerified: userData.isVerified,
                };

                localStorage.setItem('user', JSON.stringify(user));
                return { success: true, data: user };
            }

            return result;
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to fetch user',
            };
        }
    },

    // Update user profile
    updateProfile: async (userData) => {
        try {
            const result = await apiClient.put('/api/auth/profile', userData);

            if (result.success && result.data) {
                const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                const updatedUser = { ...currentUser, ...result.data };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }

            return result;
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Profile update failed',
            };
        }
    },

    // Change password
    changePassword: async (passwordData) => {
        try {
            return await apiClient.post('/api/auth/change-password', passwordData);
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Password change failed',
            };
        }
    },

    // Request password reset
    requestPasswordReset: async (email) => {
        try {
            return await apiClient.post('/api/auth/forgot-password', { email });
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Password reset request failed',
            };
        }
    },

    // Reset password with token
    resetPassword: async (token, newPassword) => {
        try {
            return await apiClient.post('/api/auth/reset-password', {
                token,
                newPassword,
            });
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Password reset failed',
            };
        }
    },

    // Verify email
    verifyEmail: async (token) => {
        try {
            return await apiClient.post('/api/auth/verify-email', { token });
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Email verification failed',
            };
        }
    },

    // Resend verification email
    resendVerification: async (email) => {
        try {
            return await apiClient.post('/api/auth/resend-verification', { email });
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to resend verification email',
            };
        }
    },

    // Refresh token
    refreshToken: async () => {
        try {
            const result = await apiClient.post('/api/auth/refresh-token');

            if (result.success && result.data.token) {
                setAuthToken(result.data.token);
            }

            return result;
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Token refresh failed',
            };
        }
    },

    // Check authentication status
    isAuthenticated: () => {
        return !!localStorage.getItem('authToken');
    },

    // Get stored user
    getStoredUser: () => {
        try {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        } catch (error) {
            return null;
        }
    },
};

export default authService;
