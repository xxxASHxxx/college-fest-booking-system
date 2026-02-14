import React, { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import { clearAuthToken } from '../utils/helpers';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Initialize auth state from localStorage
    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('authToken');
            const storedUser = authService.getStoredUser();

            console.log('[AuthContext] Initializing with token:', token ? 'exists' : 'none', 'user:', storedUser);

            if (token && storedUser) {
                // Immediately set user from localStorage (don't wait for API call)
                setUser(storedUser);
                setIsAuthenticated(true);
                console.log('[AuthContext] Set user from localStorage:', storedUser.role);

                // Verify token validity with backend
                try {
                    const result = await authService.getCurrentUser();
                    if (result.success) {
                        setUser(result.data);
                        console.log('[AuthContext] Verified user from API:', result.data.role);
                    } else {
                        // Token invalid, clear auth
                        console.log('[AuthContext] Token invalid, clearing auth');
                        setUser(null);
                        setIsAuthenticated(false);
                        clearAuthToken();
                    }
                } catch (error) {
                    console.log('[AuthContext] API verification failed, clearing auth');
                    setUser(null);
                    setIsAuthenticated(false);
                    clearAuthToken();
                }
            }

            setLoading(false);
        };

        initializeAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty deps - only run once on mount

    // Login
    const login = useCallback(async (credentials) => {
        try {
            const result = await authService.login(credentials);

            if (result.success) {
                console.log('[AuthContext] Login success, setting user:', result.data.user);
                setUser(result.data.user);
                setIsAuthenticated(true);
                return { success: true, data: result.data };
            }

            return result;
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Login failed',
            };
        }
    }, []);

    // Register
    const register = useCallback(async (userData) => {
        try {
            const result = await authService.register(userData);

            if (result.success) {
                setUser(result.data.user);
                setIsAuthenticated(true);
                return { success: true, data: result.data };
            }

            return result;
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Registration failed',
            };
        }
    }, []);

    // Logout
    const logout = useCallback(async () => {
        try {
            await authService.logout();
        } finally {
            setUser(null);
            setIsAuthenticated(false);
            clearAuthToken();
        }
    }, []);

    // Update user profile
    const updateProfile = useCallback(async (userData) => {
        try {
            const result = await authService.updateProfile(userData);

            if (result.success) {
                setUser((prev) => ({ ...prev, ...result.data }));
                return { success: true, data: result.data };
            }

            return result;
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Profile update failed',
            };
        }
    }, []);

    // Refresh user data
    const refreshUser = useCallback(async () => {
        try {
            const result = await authService.getCurrentUser();

            if (result.success) {
                setUser(result.data);
                return { success: true };
            }

            return result;
        } catch (error) {
            return { success: false };
        }
    }, []);

    // Check if user has role
    const hasRole = useCallback((role) => {
        return user?.role === role;
    }, [user]);

    // Check if user has any of the roles
    const hasAnyRole = useCallback((roles) => {
        return roles.includes(user?.role);
    }, [user]);

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
        refreshUser,
        hasRole,
        hasAnyRole,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
